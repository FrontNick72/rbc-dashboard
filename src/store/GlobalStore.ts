import { observable, action } from 'mobx';
import { TMarket, TSegment, TSubsection, TArticle } from '../App';
import { Entry } from 'contentful';
import {
  contentfulApi,
  CONFIG,
  contentfulManagementApi,
  firebaseClientInit,
  // firebaseClient,
} from '../api/api';

import {
  TArticleContent,
  TBookmark,
  TLastRequest,
  TInterview,
  TArticleBusiness,
  TUser,
} from 'dashboards/types';

import { toast } from 'react-toastify';
import checkArticlesInSegment from '../utils/checkArticlesInSegment';

const ERROR_NETWORK_ERROR = 'Возникла ошибка при отправке запроса';
const ERROR_INCORRECT_EMAIL = 'Проверьте правильность email';
const ERROR_INCORRECT_PASSWORD = 'Проверьте правильность пароля';

class GlobalStore {
  /**
   * for authentication
   */
  @observable public loading: boolean = false;
  @observable public error: string = '';
  @observable public errorEmail: string = '';
  @observable public errorPassword: string = '';
  @observable public isAuthenticated: boolean = false;
  @observable public role: string = '';
  @observable public token: string = '';
  @observable public userId: string = '';
  @observable.deep public user?: TUser;

  /**
   * general variables for work with articles
   */
  @observable public markets: TMarket[] = [];
  @observable public articlesAll: TArticleContent[] = [];
  @observable public articlesBusinessDevelopment: TArticleBusiness[] = [];
  @observable public blocks: Entry<any>[] = [];
  @observable public currentMarket?: TMarket;
  @observable public currentSegment?: TSegment | null = null;
  @observable public currentBlock?: Entry<any> | null = null;
  @observable public currentSection?: Entry<any> | null = null;
  @observable public currentSubsection?: TSubsection | null = null;
  @observable public currentArticle?: TArticle | null = null;
  @observable public articlesBlock?: TArticle[] | null = null;
  @observable public articlesMarket?: TArticle[] | null = [];
  @observable public isChanging?: boolean = false;

  /**
   * variables for work with bookmarks
   */
  @observable public bookmarks: TBookmark[] = [];
  @observable public isBookmarkAll: boolean = false;
  @observable public isBookmarkBlock: boolean = false;
  @observable public bookmarksBlockArticles: TArticle[] = [];
  @observable public bookmarksMarketArticles: TArticle[] = [];

  /**
   * variables for work with searching
   */
  @observable public searchArticles: string[] = [];
  @observable public currentSearchString: string = '';
  @observable public lastRequest: string = localStorage.getItem('last-request') || '[]';
  @observable public isSearchPage: boolean = false;
  @observable public lastRequestArticles: TLastRequest[] = [];

  @action
  public enableChanging = () => {
    this.isChanging = true;
  };

  @action
  public disableChanging = () => {
    this.isChanging = false;
  };

  @action
  public reauthenticate = async (currentPassword: string) => {
    const user = firebaseClientInit.auth().currentUser;

    if (user && user.email) {
      try {
        const cred = await firebaseClientInit
          .auth()
          .signInWithEmailAndPassword(user.email, currentPassword);

        if (cred.credential) {
          return user.reauthenticateWithCredential(cred.credential);
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
            this.errorEmail = ERROR_INCORRECT_EMAIL;
            break;

          case 'auth/wrong-password':
            this.errorPassword = ERROR_INCORRECT_PASSWORD;
            break;
          default:
            break;
        }
      }
    }
  };

  @action
  public clearErrors = () => {
    this.errorEmail = '';
    this.errorPassword = '';
  };

  @action
  public sendPasswordReset = async (email: string) => {
    return await firebaseClientInit
      .auth()
      .sendPasswordResetEmail(email, { url: window.location.href })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
            this.errorEmail = ERROR_INCORRECT_EMAIL;
            break;

          case 'auth/wrong-password':
            this.errorPassword = ERROR_INCORRECT_PASSWORD;
            break;
          default:
            break;
        }
        this.loading = false;
        this.error = error.message;
      });
  };

  @action
  public authenticate = async (
    isAuth: boolean,
    dataUser?: firebase.User,
    userID?: string,
    token?: string
  ) => {
    this.loading = true;

    if (isAuth && dataUser) {
      await dataUser.getIdTokenResult().then((result) => {
        this.token = result.token;
        this.user = {
          userId: dataUser.uid,
          email: dataUser.email ? dataUser.email : '',
        };
        localStorage.setItem('userId', dataUser.uid);
        localStorage.setItem('token', result.token);
        this.getUser(dataUser.uid);
        this.isAuthenticated = true;
      });
    } else if (userID && token) {
      this.user = {
        userId: userID,
        email: '',
      };

      this.token = token;

      this.getUser(userID, true);
      this.isAuthenticated = true;
    }
  };

  @action
  public logout = async () => {
    this.token = '';
    this.userId = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isAuthenticated = false;
    this.loading = true;
    this.loading = false;
  };

  @action
  public changePassword = async (oldPassword: string, newPassword: string) => {
    this.loading = true;
    const user = firebaseClientInit.auth().currentUser;
    try {
      // reauthenticating
      await this.reauthenticate(oldPassword);
      // updating password
      if (user) {
        await user.updatePassword(newPassword).then(() => {
          toast.success('Пароль изменён');
        });
      }
    } catch (err) {
      console.error('Ошибка изменения пароля', err);
    }

    this.loading = false;
  };

  @action
  public getUserToken = async (email: string, password: string) => {
    this.loading = true;
    try {
      await firebaseClientInit
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => data.user && this.authenticate(true, data.user))
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
            case 'auth/user-not-found':
              this.errorEmail = ERROR_INCORRECT_EMAIL;
              break;

            case 'auth/wrong-password':
              this.errorPassword = ERROR_INCORRECT_PASSWORD;
              break;
            default:
              break;
          }
          this.loading = false;
          this.error = error.message;
        });
    } catch (error) {
      console.error('error', error);
      this.error = ERROR_NETWORK_ERROR;
    }
  };

  @action
  public updateUser = async (userData: TUser) => {
    if (this.user) {
      this.user = Object.assign(this.user, userData);
      contentfulManagementApi.updateUser(this.userId, userData);
    }
  };

  @action
  public enableBookmarksAll = () => {
    this.isBookmarkAll = true;
    this.articlesBlock = [];
    this.isBookmarkBlock = false;
    this.currentBlock = null;
    this.currentSection = null;
    this.currentSubsection = null;
    this.currentSegment = null;

    if (this.bookmarksMarketArticles.length) {
      this.updateBookmarksBlockArticles();
      this.changeCurrentArticle(this.bookmarksBlockArticles[0]);
    }
  };

  @action
  public enableTabBookmark = () => {
    this.isBookmarkBlock = true;
    this.currentSection = null;
    this.currentSubsection = null;
  };

  @action
  public enableSearchPage = () => {
    this.isSearchPage = true;
    this.currentSegment = null;
  };

  @action
  public setCurrentSearchString = (searchString: string) => {
    this.currentSearchString = searchString;
  };

  /**
   * function for update idEntry for old bookmark
   *
   * @memberof GlobalStore
   */
  @action
  public updateBookmarkEntry = (bookmark: TBookmark) => {};

  /**
   * function for adding/deleting bookmarks
   *
   * @memberof GlobalStore
   */
  @action
  public updateBookmarksApi = (bookmarks: TBookmark[], deletedBookmark?: TBookmark) => {
    if (deletedBookmark) {
      contentfulManagementApi.deleteBookmark(deletedBookmark, this.userId, bookmarks);
    } else {
      contentfulManagementApi.createBookmark(bookmarks, this.userId);
    }

    this.bookmarks = bookmarks;

    this.updateBookmarksBlockArticles();
  };

  /**
   * function for adding query string
   *
   * @memberof GlobalStore
   */
  @action
  public pushLastRequest = (lastRequest: string) => {
    if (lastRequest) {
      this.lastRequest = lastRequest;
      localStorage.setItem('last-request', lastRequest);

      this.updateLastRequestLayout();
    }
  };

  /**
   * fucntion for update array last response queries
   *
   * @memberof GlobalStore
   */
  @action
  public updateLastRequestLayout = () => {
    if (this.lastRequest && this.lastRequest.length) {
      this.lastRequestArticles = [];

      [...JSON.parse(this.lastRequest)].reverse().forEach((request: TLastRequest, index) => {
        if (index < 5) {
          this.lastRequestArticles.push(request);
        }
      });
    }
  };

  /**
   * function for get array articles which bookmarked
   *
   * @memberof GlobalStore
   */
  @action
  public updateBookmarksBlockArticles = (isBlock?: boolean) => {
    if (
      this.bookmarks &&
      this.bookmarks.length &&
      this.articlesBlock &&
      this.articlesBlock.length
    ) {
      this.bookmarksBlockArticles = this.articlesBlock.filter((article) =>
        this.bookmarks.some(
          (bookmark: TBookmark) =>
            bookmark.idMarket === (this.currentMarket ? this.currentMarket.id : '') &&
            bookmark.idBlock === article.block!.sys.id &&
            bookmark.idArticle === article.id &&
            bookmark.idSubsection === (article.subSection ? article.subSection.sys.id : '') &&
            bookmark.idSection === article.section!.sys.id
        )
      );

      if (!this.bookmarksBlockArticles.length && this.isBookmarkBlock) {
        this.isBookmarkBlock = false;
        this.changeCurrentSection(this.articlesBlock[0].section);
      }
    } else if (
      this.bookmarks &&
      this.bookmarks.length &&
      this.currentMarket &&
      this.articlesMarket &&
      !isBlock
    ) {
      this.bookmarksBlockArticles = this.articlesMarket.filter((article) =>
        this.bookmarks.some(
          (bookmark: TBookmark) =>
            bookmark.idMarket === (this.currentMarket ? this.currentMarket.id : '') &&
            bookmark.idBlock === article.block!.sys.id &&
            bookmark.idArticle === article.id &&
            bookmark.idSubsection === (article.subSection ? article.subSection.sys.id : '') &&
            bookmark.idSection === article.section!.sys.id
        )
      );

      this.bookmarksMarketArticles = this.articlesMarket.filter((article) =>
        this.bookmarks.some(
          (bookmark: TBookmark) =>
            bookmark.idMarket === (this.currentMarket ? this.currentMarket.id : '') &&
            bookmark.idBlock === article.block!.sys.id &&
            bookmark.idArticle === article.id &&
            bookmark.idSubsection === (article.subSection ? article.subSection.sys.id : '') &&
            bookmark.idSection === article.section!.sys.id
        )
      );

      if (!this.bookmarksBlockArticles.length && this.isBookmarkBlock) {
        this.isBookmarkBlock = false;
      } else if (!this.bookmarksMarketArticles.length && this.isBookmarkAll) {
        this.isBookmarkAll = false;
      }
    } else {
      this.bookmarksBlockArticles = [];
    }
  };

  @action
  public getArticlesMarket = () => {
    let blocks: {
      item: Entry<any>;
      segment: Entry<any> | null;
    }[] = [];

    if (this.currentMarket) {
      if (this.currentMarket.blocks && this.currentMarket.blocks.length) {
        this.currentMarket.blocks.forEach((block) => {
          blocks.push({
            item: block,
            segment: null,
          });
        });
      } else if (this.currentMarket.segments && this.currentMarket.segments.length) {
        this.currentMarket.segments.forEach((segment) => {
          if (segment.fields && segment.fields.block && segment.fields.block.length) {
            segment.fields.block.forEach((block: Entry<any>) => {
              blocks.push({
                item: block,
                segment: segment,
              });
            });
          }
        });
      }

      blocks.forEach((block) => {
        const arrayArticlesFromBlock = this.getArticlesIdFromBlock(block, true);
        arrayArticlesFromBlock &&
          arrayArticlesFromBlock.forEach((article: TArticle) => {
            this.articlesMarket && this.articlesMarket.push(article);
          });
      });

      if (this.articlesMarket && this.articlesMarket.length) {
        this.updateBookmarksBlockArticles();
        this.updateLastRequestLayout();
      }
    }
  };

  @action
  public changeCurrentMarket = (idMarket: string) => {
    this.blocks = [];
    this.currentSegment = null;

    this.markets.forEach((market) => {
      if (market.id === idMarket) {
        if (market.blocks) {
          this.blocks = market.blocks;
        } else if (market.segments) {
          const indexSegmentWithBlocks = market.segments.findIndex((segment) => {
            return checkArticlesInSegment(segment);
          });

          this.blocks =
            indexSegmentWithBlocks >= 0 ? market.segments[indexSegmentWithBlocks].fields.block : [];

          if (indexSegmentWithBlocks >= 0) {
            this.currentSegment = {
              id: market.segments[indexSegmentWithBlocks].sys.id,
              block: market.segments[indexSegmentWithBlocks].fields.block,
              name: market.segments[indexSegmentWithBlocks].fields.name,
            };
          }

          market.segments.map((segment: Entry<any> & { checked: boolean }, index: number) => {
            if (indexSegmentWithBlocks >= 0 && index === indexSegmentWithBlocks) {
              segment.checked = true;
            } else {
              segment.checked = false;
            }

            return segment;
          });
        }

        this.currentMarket = market;
        this.currentBlock = null;
        this.currentSection = null;
        this.currentSubsection = null;
        this.currentArticle = null;
        this.isBookmarkBlock = false;
        this.isBookmarkAll = false;
        this.isSearchPage = false;
        this.articlesBlock = [];
        this.articlesMarket = [];
        this.currentSearchString = '';

        this.fetchArticlesBusinessDevelopment();
        this.getArticlesMarket();

        if (this.articlesMarket && this.articlesMarket.length) {
          this.updateBookmarksBlockArticles();
          this.updateLastRequestLayout();
        } else {
          this.bookmarksBlockArticles = [];
        }
      }
    });
  };

  @action
  public changeCurrentBlock = (block: Entry<any> | null, article?: TArticle, isClick?: boolean) => {
    this.currentBlock = block;
    this.searchArticles = [];
    this.isSearchPage = false;
    this.isBookmarkBlock = false;
    this.articlesBlock = [];

    this.getArticlesIdFromBlock({
      segment: article && article.segment ? article.segment : null,
      item: block ? block : null,
    });

    if (article && article.section) {
      if (isClick) {
        this.enableChanging();
      }

      this.changeCurrentArticle(article, true);

      if (isClick) {
        const idBlock = article.block ? article.block.sys.id + '-' : '';
        const idSection = article.section ? article.section.sys.id + '-' : '';
        const idSubSection = article.subSection ? article.subSection.sys.id + '-' : '';

        window.location.hash = '';
        setTimeout(() => {
          window.location.hash = `${idBlock}${idSection}${idSubSection}${article.id}`;
        }, 300);
      }
    }
  };

  /**
   * function for change block and his section
   *
   * @memberof GlobalStore
   */
  @action
  public linkToContent = (section: Entry<any> | null, block: Entry<any> | null): void => {
    this.enableChanging();
    this.changeCurrentBlock(block);

    if (section && block) {
      this.changeCurrentSection(section);
      const subSectionId =
        section && section.fields && section.fields.items && section.fields.items[0].fields.items
          ? `${section.fields.items[0].sys.id}-`
          : '';
      const articleId =
        subSectionId &&
        section.fields.items &&
        section.fields.items[0].fields &&
        section.fields.items[0].fields.items
          ? section.fields.items[0].fields.items[0].sys.id
          : section.fields.items
          ? section.fields.items[0].sys.id
          : '';

      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = `${block.sys.id}-${section.sys.id}-${subSectionId}${articleId}`;
      }, 300);
    }
  };

  /**
   * function for get array array articles from block
   *
   * @memberof GlobalStore
   */
  @action
  public getArticlesIdFromBlock = (
    block: {
      segment: Entry<any> | null;
      item: Entry<any> | null;
    },
    isForMarket?: boolean
  ): TArticle[] | undefined => {
    const articlesBlock: TArticle[] = [];

    if (block && block.item && block.item.fields && block.item.fields.sections) {
      block.item.fields.sections.forEach((section: Entry<any>) => {
        if (section && section.fields && section.fields.items) {
          section.fields.items.forEach((item: Entry<any>) => {
            const subSectionPath =
              item && item.fields && item.fields.items ? `${item.fields.name} /` : '';
            const sectionPath = section ? `${section.fields.name} /` : '';
            const subSectionId =
              section &&
              section.fields &&
              section.fields.items &&
              section.fields.items[0].fields.items
                ? `${section.fields.items[0].sys.id}-`
                : '';
            const blockPath = block && block.item ? `${block.item.fields.name} /` : '';
            const marketPath = this.currentMarket ? `${this.currentMarket.name} /` : '';
            const segmentPath = block && block.segment ? `${block.segment.fields.name} /` : '';
            const pathString =
              marketPath +
              ' ' +
              segmentPath +
              ' ' +
              blockPath +
              ' ' +
              sectionPath +
              ' ' +
              subSectionPath;

            if (item && item.fields && item.fields.items) {
              item.fields.items.forEach((itemInner: Entry<any>) => {
                const pathHashString = `${block.item!.sys.id}-${section.sys.id}-${subSectionId}${
                  itemInner.sys.id
                }`;

                articlesBlock.push({
                  id: itemInner.sys.id,
                  block: block.item,
                  segment: block.segment ? block.segment : null,
                  subSection: {
                    idSection: section.sys.id,
                    ...item,
                  },
                  section: section,
                  content: this.articlesAll.filter((article) => article.id === itemInner.sys.id)[0],
                  path: pathString,
                  pathHash: pathHashString,
                });
              });
            } else {
              const pathHashString = `${block.item!.sys.id}-${section.sys.id}-${subSectionId}${
                item.sys.id
              }`;

              articlesBlock.push({
                id: item.sys.id,
                block: block.item,
                segment: block.segment ? block.segment : null,
                subSection: null,
                section: section,
                content: this.articlesAll.filter((article) => article.id === item.sys.id)[0],
                path: pathString,
                pathHash: pathHashString,
              });
            }
          });
        }
      });
    }

    if (!isForMarket) {
      this.articlesBlock = articlesBlock;
      this.updateBookmarksBlockArticles();
      return this.articlesBlock;
    } else {
      return articlesBlock;
    }
  };

  /**
   * function for changing current article and set current section and subsection
   *
   * @memberof GlobalStore
   */
  @action
  public changeCurrentArticle = (article: TArticle, isScroll?: boolean, hash?: string) => {
    this.currentArticle = article;

    if (
      !this.isBookmarkBlock &&
      isScroll &&
      article.subSection &&
      article.section &&
      ((this.currentSubsection && article.subSection.sys.id !== this.currentSubsection.sys.id) ||
        !this.currentSubsection)
    ) {
      this.changeCurrentSubsection(article.subSection, article.section, article);
    } else if (
      !this.isBookmarkBlock &&
      isScroll &&
      article.section &&
      this.currentSection &&
      article.section.sys.id !== this.currentSection.sys.id
    ) {
      this.changeCurrentSubsection(null, null, undefined);
      this.changeCurrentSection(article.section, article);
    } else if (
      !this.isBookmarkBlock &&
      !article.subSection &&
      article.section &&
      this.currentSection &&
      article.section.sys.id === this.currentSection.sys.id
    ) {
      this.changeCurrentSubsection(null, article.section, undefined);
    } else if (
      article.section &&
      !this.isSearchPage &&
      !this.isBookmarkBlock &&
      !this.currentSection &&
      !article.subSection
    ) {
      this.changeCurrentSection(article.section);
    }

    if (hash) {
      window.location.hash = '';
      setTimeout(() => {
        window.location.hash = hash;
      }, 300);
    }
  };

  @action
  public changeCurrentSection = (section: Entry<any> | null, article?: TArticle) => {
    this.isBookmarkBlock = false;
    this.currentSection = section;
    const idBlock = article && article.block ? article.block.sys.id + '-' : '';
    const idSection = article && article.section ? article.section.sys.id + '-' : '';
    const idSubSection = article && article.subSection ? article.subSection.sys.id + '-' : '';

    if (
      section &&
      section.fields &&
      section.fields.items &&
      section.fields.items.length &&
      section.fields.items[0] &&
      section.fields.items[0].fields.items
    ) {
      this.currentSubsection = {
        idSection: section.sys.id,
        ...section.fields.items[0],
      };

      if (!article && this.articlesBlock) {
        this.articlesBlock.forEach((articleItem) => {
          if (
            this.currentSubsection &&
            articleItem.id === this.currentSubsection.fields.items[0].sys.id
          ) {
            this.changeCurrentArticle(articleItem);
          }
        });
      } else if (
        (article && !this.currentArticle) ||
        (article &&
          this.currentArticle &&
          this.changeCurrentArticle &&
          this.currentArticle.id !== article.id)
      ) {
        this.changeCurrentArticle(
          article,
          false,
          `${idBlock}${idSection}${idSubSection}${article.id}`
        );
      }
    } else if (
      this.currentSection &&
      this.currentSection.fields &&
      this.currentSection.fields.items
    ) {
      this.currentSubsection = null;

      if (!article) {
        this.articlesBlock!.forEach((articleItem) => {
          if (articleItem.id === this.currentSection!.fields.items[0].sys.id) {
            this.changeCurrentArticle(articleItem);
          }
        });
      } else if (
        !this.currentArticle ||
        (this.changeCurrentArticle && this.currentArticle.id !== article.id)
      ) {
        this.changeCurrentArticle(
          article,
          false,
          `${idBlock}${idSection}${idSubSection}${article.id}`
        );
      }
    }
  };

  @action
  public changeCurrentSubsection = (
    subsection: TSubsection | null,
    section: Entry<any> | null,
    article?: TArticle
  ) => {
    this.isBookmarkBlock = false;
    this.currentSection = section;
    this.currentSubsection = subsection;

    if (section) {
      this.currentSection = section;
    }

    if (!article) {
      this.articlesBlock &&
        this.articlesBlock.forEach((articleItem) => {
          if (subsection && articleItem.id === subsection.fields.items[0].sys.id) {
            this.changeCurrentArticle(articleItem);
          }
        });
    }
  };

  @action
  public changeCurrentSegment = (segment: TSegment | null) => {
    this.currentSegment = segment;
  };

  @action
  public updateBlocks = (blocks: Entry<any>[] | null) => {
    this.blocks = blocks ? blocks : [];
  };

  /**
   * async function for get found articles in a search
   *
   * @memberof GlobalStore
   */
  @action
  public fetchSlugArticles = async (slug: string) => {
    const articlessPromise = await contentfulApi.getArticles(slug);
    this.searchArticles = [];
    const searchArticles: string[] = [];

    articlessPromise.forEach((article) => {
      const contentType = article.sys.contentType.sys.id;
      let idArticle: string = article.sys.id;

      if (contentType === 'interviewQuestion' && this.articlesMarket) {
        const filtredArticles = this.articlesMarket.filter((articleMarket) => {
          if (
            articleMarket.content.contentType === 'interview' &&
            (articleMarket.content as TInterview).interviewQuestion
          ) {
            return (articleMarket.content as TInterview).interviewQuestion!.some(
              (question) => question.sys.id === article.sys.id
            );
          } else {
            return false;
          }
        });

        if (filtredArticles.length) {
          idArticle = filtredArticles[0].id;
        }
      }

      if (this.articlesMarket && this.articlesMarket.length) {
        const articleMarket = this.articlesMarket.filter(
          (marketArticle) => marketArticle.id === idArticle
        )[0];

        if (articleMarket && searchArticles.indexOf(idArticle) === -1) {
          searchArticles.push(idArticle);
        }
      }
    });

    if (slug) {
      this.setSearchArticles(searchArticles);
    } else {
      this.setSearchArticles([]);
    }
  };

  /**
   * async function for get all articles
   *
   * @memberof GlobalStore
   */
  @action
  public fetchArticles = async (marketsID: string[]) => {
    const articlessPromise = await contentfulApi.getArticles();
    const articlesAll: TArticleContent[] = [];

    articlessPromise.forEach((article) => {
      const contentType = article.sys.contentType.sys.id;
      const articleObject: TArticleContent = {
        id: article.sys.id,
        contentType: contentType,
        ...article.fields,
      };

      articlesAll.push(articleObject);
    });

    this.articlesAll = articlesAll;
    this.fetchMarkets(marketsID);
  };

  @action
  public setSearchArticles = async (searchArticles: string[]) => {
    this.searchArticles = searchArticles;
  };

  @action
  public getUser = async (userId: string, isAuth?: boolean) => {
    const user = await contentfulApi.getUser(userId);

    if (user && user.length && user[0].fields) {
      let userData = user[0].fields;

      this.userId = user[0].sys.id;

      if (isAuth && userData.email) {
        firebaseClientInit.auth();
      }

      if (userData.markets) {
        const marketsID = userData.markets.map((market: Entry<any>) => {
          return market.sys.id;
        });
        this.fetchArticles(marketsID);
      }

      if (userData.bookmarks && userData.bookmarks.length) {
        const bookmarkNew: TBookmark[] = [];

        userData.bookmarks.forEach((bookmark: Entry<TBookmark>) => {
          if (bookmark.fields) {
            bookmarkNew.push({
              idEntry: bookmark.sys.id,
              ...bookmark.fields,
            });
          }
        });

        userData.bookmarks = bookmarkNew;
        this.bookmarks = bookmarkNew;
      }

      this.user = Object.assign(this.user, userData);
    }
  };

  /**
   * async function for get all markets
   *
   * @memberof GlobalStore
   */
  @action
  public fetchMarkets = async (marketsID: string[]) => {
    const sectionsPromise = contentfulApi.getEntriesByType(CONFIG.contentTypeIds.section);
    const marketsPromise = contentfulApi.getEntriesByType(CONFIG.contentTypeIds.market);
    const segmentPromise = contentfulApi.getEntriesByType(CONFIG.contentTypeIds.segment);

    const fetchedData = await Promise.all([sectionsPromise, marketsPromise, segmentPromise]);
    const sectionsRaw = fetchedData[0];
    const marketsRaw = fetchedData[1];
    const segmentsRaw = fetchedData[2];

    const markets: TMarket[] = [];

    marketsRaw.forEach((item, index) => {
      if (marketsID.indexOf(item.sys.id) !== -1) {
        let blocks = item.fields.items ? item.fields.items : null;

        if (blocks) {
          blocks.forEach((block: Entry<any>) => {
            if (block.fields && block.fields.sections) {
              block.fields.sections.forEach((section: Entry<any>) => {
                const currentSection = sectionsRaw.filter((sect) => section.sys.id === sect.sys.id);

                if (currentSection.length && currentSection[0] && currentSection[0].fields) {
                  section.fields = currentSection[0].fields;
                }
              });
            }
          });
        }

        let segments = item.fields.segment
          ? item.fields.segment.map((segment: Entry<any> & { checked: boolean }, index: number) => {
              const currentSegment = segmentsRaw.filter(
                (segmentInner) => segmentInner.sys.id === segment.sys.id
              )[0];

              if (currentSegment.fields && currentSegment.fields.block) {
                currentSegment.fields.block.map((block: Entry<any>) => {
                  if (block.fields && block.fields.sections) {
                    block.fields.sections.map((section: Entry<any>) => {
                      const currentSection = sectionsRaw.filter(
                        (sect) => section.sys.id === sect.sys.id
                      );
                      section.fields = currentSection.length && currentSection[0].fields;

                      return section;
                    });
                  }

                  return block;
                });

                const checked = index === 0 && (!blocks || !blocks.length);

                return {
                  ...currentSegment,
                  checked: checked,
                };
              } else {
                return null;
              }
            })
          : null;

        if (segments) {
          segments = segments.filter(
            (segment: Entry<any> & { checked: boolean }) => segment !== null
          );
        }

        markets.push({
          id: item.sys.id,
          name: item.fields.name,
          segments: segments,
          blocks: blocks,
        });
      }
    });

    this.currentMarket = markets[0];
    this.fetchArticlesBusinessDevelopment();

    if (markets[0].blocks) {
      this.blocks = markets[0].blocks;
    } else if (markets[0].segments) {
      const indexSegmentWithBlocks = markets[0].segments.findIndex((segment) => {
        return segment.fields.block && segment.fields.block.length;
      });

      this.blocks =
        indexSegmentWithBlocks >= 0 ? markets[0].segments[indexSegmentWithBlocks].fields.block : [];
    }

    this.getArticlesMarket();
    this.markets = markets;
    this.loading = false;
  };

  /**
   * async function for get business development articles for current market
   *
   * @memberof GlobalStore
   */
  @action
  public fetchArticlesBusinessDevelopment = async () => {
    const businessPromise = await contentfulApi.getEntriesByType(CONFIG.contentTypeIds.business);

    const businessArticles: TArticleBusiness[] = [];

    businessPromise.forEach((business) => {
      const businessArticle: TArticleBusiness = {
        id: business.sys.id,
        ...business.fields,
      };

      const isView = businessArticle.related.some(
        (market) => this.currentMarket && market.sys.id === this.currentMarket.id
      );

      if (isView) {
        businessArticles.push(businessArticle);
      }
    });

    if (businessArticles && businessArticles.length) {
      this.articlesBusinessDevelopment = businessArticles;
    } else {
      this.articlesBusinessDevelopment = [];
    }
  };
}

export default GlobalStore;
