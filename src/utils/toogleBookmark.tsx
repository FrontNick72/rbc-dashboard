import { TBookmark } from 'dashboards/types';
import { TArticle } from '../App';

const toggleBookmark = (
  article: TArticle,
  idBlock: string,
  idMarket: string,
  bookmarks: TBookmark[]
) => {
  const bookmarksArray: TBookmark[] = bookmarks ? bookmarks : [];

  let indexArticle: number | null = null;
  let deletedBookmark: TBookmark | null = null;

  bookmarksArray.forEach((bookmark: TBookmark, index) => {
    if (
      bookmark.idArticle === article.id &&
      bookmark.idSubsection === (article.subSection ? article.subSection.sys.id : '') &&
      bookmark.idSection === article.section!.sys.id &&
      bookmark.idBlock === idBlock &&
      bookmark.idMarket === idMarket
    ) {
      indexArticle = index;
    }
  });

  if (indexArticle === null) {
    bookmarksArray.push({
      idEntry: '',
      idArticle: article.id,
      idSubsection: article.subSection ? article.subSection.sys.id : '',
      idSection: article.section!.sys.id,
      idBlock: idBlock,
      idMarket: idMarket,
    });
  } else {
    deletedBookmark = bookmarksArray[indexArticle];
    bookmarksArray.splice(indexArticle, 1);
  }

  return {
    deletedBookmark: deletedBookmark,
    items: bookmarksArray,
  };
};

export default toggleBookmark;
