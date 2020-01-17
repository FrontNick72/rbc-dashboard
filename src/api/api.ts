import { createClient, Entry } from 'contentful';
import * as contentfullManagement from 'contentful-management';
import axios, { AxiosResponse } from 'axios';
import { TUser, TBookmark } from 'dashboards/types';
import * as firebase from 'firebase/app';
import { toast } from 'react-toastify';
import 'firebase/auth';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const firebaseClientInit = firebase.initializeApp(firebaseConfig);

const objToUri = (params: any) =>
  Object.keys(params)
    .map((k) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');

export interface IRequestParams {
  url: string;
  data?: any;
  urlParams?: any;
}

export interface IRequestErrorHandling {
  anyErrorMessage: string;
}

export interface IRequestParamsWithMethod extends IRequestParams {
  method: 'post' | 'get' | 'patch' | 'put' | 'delete';
}

export const CONFIG = {
  space: '', //hide
  accessToken: '', //hide
  manageAccessToken: '', // hide
  contentTypeIds: {
    market: 'market',
    section: 'section',
    segment: 'segment',
    thesis: 'thesis',
    digital: 'digital',
    interview: 'interview',
    business: 'business_development',
  },
};

class ContentfullManagementService {
  private cdaClient = contentfullManagement.createClient({
    accessToken: CONFIG.manageAccessToken,
  });

  deleteBookmark = async (bookmark: TBookmark, userID: string, bookmarks: TBookmark[]) => {
    return await this.cdaClient.getSpace(CONFIG.space).then((space) => {
      const allBookmarks = space.getEntries({ content_type: 'bookmark' }).then((entry) => {
        return entry.items;
      });

      allBookmarks.then((response) => {
        const oldBookmark = response.filter((oldBookmark) => {
          if (oldBookmark.fields && oldBookmark.fields.idArticle) {
            return (
              oldBookmark.fields.idArticle['en-US'] === bookmark.idArticle &&
              oldBookmark.fields.idSubsection['en-US'] === bookmark.idSubsection &&
              oldBookmark.fields.idSection['en-US'] === bookmark.idSection &&
              oldBookmark.fields.idBlock['en-US'] === bookmark.idBlock &&
              oldBookmark.fields.idMarket['en-US'] === bookmark.idMarket
            );
          } else {
            return false;
          }
        })[0];

        oldBookmark.unpublish().then((entry) => {
          this.updateUser(userID, undefined, bookmarks).then(() => {
            entry.delete();
          });
        });
      });
    });
  };

  createBookmark = (bookmarks: TBookmark[], userID: string) => {
    this.cdaClient.getSpace(CONFIG.space).then((space) => {
      const allBookmarks = space.getEntries({ content_type: 'bookmark' }).then((entry) => {
        return entry.items;
      });

      allBookmarks.then((response) => {
        bookmarks.forEach((bookmark) => {
          const filterArray = response.filter((oldBookmark) => {
            if (oldBookmark.fields && oldBookmark.fields.idArticle) {
              return (
                oldBookmark.fields.idArticle['en-US'] === bookmark.idArticle &&
                oldBookmark.fields.idSubsection['en-US'] === bookmark.idSubsection &&
                oldBookmark.fields.idSection['en-US'] === bookmark.idSection &&
                oldBookmark.fields.idBlock['en-US'] === bookmark.idBlock &&
                oldBookmark.fields.idMarket['en-US'] === bookmark.idMarket
              );
            }
          });

          if (!filterArray.length) {
            space
              .createEntry('bookmark', {
                fields: {
                  idArticle: { 'en-US': bookmark.idArticle },
                  idSubsection: { 'en-US': bookmark.idSubsection },
                  idSection: { 'en-US': bookmark.idSection },
                  idBlock: { 'en-US': bookmark.idBlock },
                  idMarket: { 'en-US': bookmark.idMarket },
                },
              })
              .then((entry) => {
                entry.publish().then(() => {
                  this.updateUser(userID, undefined, bookmarks, entry.sys.id, bookmark);

                  return bookmarks;
                });
              });
          }
        });
      });
    });
  };

  updateUser = async (
    userID: string,
    userData?: TUser,
    bookmarks?: any,
    entryId?: string,
    bookmarkNew?: TBookmark
  ) => {
    return await this.cdaClient
      .getSpace(CONFIG.space)
      .then((space) => space.getEntry(userID))
      .then((entry) => {
        if (userData && !bookmarks) {
          Object.keys(userData).forEach((data) => {
            entry.fields[data]['en-US'] = userData[data as keyof TUser];
          });
        }

        if (bookmarks) {
          let updatedBookmarks: any = [];

          if (bookmarkNew && entryId) {
            bookmarks.map((bookmark: TBookmark) => {
              if (
                bookmarkNew.idArticle === bookmark.idArticle &&
                bookmarkNew.idSubsection === bookmark.idSubsection &&
                bookmarkNew.idSection === bookmark.idSection &&
                bookmarkNew.idBlock === bookmark.idBlock &&
                bookmarkNew.idMarket === bookmark.idMarket
              ) {
                bookmark.idEntry = entryId;
              }

              return bookmark;
            });
          }

          bookmarks.forEach((bookmark: TBookmark) => {
            updatedBookmarks.push({
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: bookmark.idEntry,
              },
            });
          });

          if (entry.fields.bookmarks) {
            entry.fields['bookmarks']['en-US'] = updatedBookmarks;
          } else {
            entry.fields.bookmarks = {
              'en-US': updatedBookmarks,
            };
          }
        }

        return entry.update();
      })
      .then((entry) =>
        entry.publish().then((val) => {
          if (!bookmarks) {
            toast.success('Пользователь обновлён');
          }
        })
      )
      .catch(() => {
        if (!bookmarks) {
          toast.error('Произошла ошибка');
        }
      });
  };
}

class ContentfulDeliveryService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  getArticles = async (slug?: string, limit?: number) => {
    const contentTypeQuestion = slug ? ',interviewQuestion' : '';

    const articlessPromise = this.getAllContent({
      query: slug,
      limit: limit ? limit : 1000,
      include: 10,
      order: '-sys.updatedAt',
      'sys.contentType.sys.id[in]': `${CONFIG.contentTypeIds.digital},${CONFIG.contentTypeIds.thesis},${CONFIG.contentTypeIds.interview}${contentTypeQuestion}`,
    });

    return articlessPromise;
  };

  getEntriesByType(type: string, query?: object): Promise<Entry<any>[]> {
    return this.cdaClient
      .getEntries(
        Object.assign(
          {
            content_type: type,
          },
          query
        )
      )
      .then((res) => res.items);
  }

  getEntry(query: string): Promise<Entry<any>> {
    return this.cdaClient.getEntry(query).then((res) => res);
  }

  getAllContent(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(query).then((res) => res.items);
  }

  getUser(userId: string): Promise<Entry<any>[]> {
    return this.cdaClient
      .getEntries({
        content_type: 'user',
        'fields.userId[in]': userId,
      })
      .then((res) => res.items);
  }
}

class Api {
  public get = (params: IRequestParams, errorHandling?: IRequestErrorHandling) => {
    return this.request({ ...params, method: 'get' }, errorHandling);
  };
  public post = (params: IRequestParams, errorHandling?: IRequestErrorHandling) => {
    return this.request({ ...params, method: 'post' }, errorHandling);
  };

  private request = async (
    params: IRequestParamsWithMethod,
    errorHandling?: IRequestErrorHandling
  ) => {
    const urlParams = params.urlParams ? `&${objToUri(params.urlParams)}` : '';
    const token = localStorage.getItem('token');

    const requestUrl = `${params.url}${urlParams}`;

    const requestParam = {
      ...params,
      headers: {
        Authorization: token,
      },
      url: requestUrl,
    };

    const response: AxiosResponse = await axios(requestParam);

    return response;
  };
}

export const contentfulApi = new ContentfulDeliveryService();
export const contentfulManagementApi = new ContentfullManagementService();
export const api = new Api();
