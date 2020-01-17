import React from 'react';
import cn from 'classnames';
import './SideMenuContainer.scss';
import { Resizable } from 're-resizable';
import Icon from '../../components/Icon';
import Conditional from '../../components/Conditional';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { Entry } from 'contentful';
import { TInterview, TThesis, TArticleContent, TBookmark } from 'dashboards/types';
import { TSubsection, TArticle } from '../../App';
import toggleBookmark from '../../utils/toogleBookmark';
import Scrollbars from 'react-custom-scrollbars';

interface ISideMenuContainerState {
  openedSections: string[];
  articlesArray: TArticle[];
  idSection: string | null;
  idSubsection: string | null;
}

interface ISideMenuContainerProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class SideMenuContainer extends React.Component<ISideMenuContainerProps, ISideMenuContainerState> {
  state: ISideMenuContainerState = {
    openedSections: [],
    articlesArray: [],
    idSection: null,
    idSubsection: null,
  };

  openSubsectionHandler(id: string, isChoose?: boolean) {
    const updateOpenedSections = this.state.openedSections;
    const hasId = updateOpenedSections.indexOf(id);
    let change = false;

    if (hasId !== -1 && !isChoose) {
      change = true;
      updateOpenedSections.splice(hasId, 1);
    } else if (hasId === -1) {
      change = true;
      updateOpenedSections.push(id);
    }

    if (change) {
      this.setState({ openedSections: updateOpenedSections });
    }
  }

  changeArticlesArray(isSubsection?: boolean) {
    const {
      currentSubsection,
      currentSection,
      currentBlock,
      articlesBlock,
    } = this.props.globalStore!;
    let articlesArray: TArticle[] = [];

    if (currentSubsection && currentSubsection.idSection && !isSubsection) {
      this.openSubsectionHandler(currentSubsection.idSection, true);
    }

    if (
      currentBlock &&
      currentSection &&
      currentSection.fields &&
      currentSection.fields.items &&
      currentSection.fields.items.length
    ) {
      currentSection.fields.items.forEach((item: Entry<any> & TArticleContent) => {
        if (item.fields.items) {
          item.fields.items.forEach((itemSub: Entry<any>) => {
            const articleData =
              articlesBlock &&
              articlesBlock.filter(
                (article) =>
                  article.content.id === itemSub.sys.id &&
                  article.section &&
                  article.section.sys.id === currentSection.sys.id
              )[0];

            articlesArray.push({
              id: (itemSub as Entry<any>).sys.id,
              segment: null,
              section: articleData!.section,
              subSection: articleData!.subSection,
              block: currentBlock,
              content: articleData!.content,
            });
          });
        } else {
          if ((item as Entry<any>).sys && (item as Entry<any>).sys.id) {
            articlesArray.push({
              id: (item as Entry<any>).sys.id,
              segment: null,
              section: currentSection,
              subSection: null,
              block: currentBlock,
              content: (item as Entry<any>).fields,
            });
          } else {
            articlesArray.push({
              id: (item as TArticleContent).id,
              segment: null,
              section: currentSection,
              subSection: null,
              block: currentBlock,
              content: item as TArticleContent,
            });
          }
        }
      });

      this.setState({
        articlesArray: articlesArray,
        idSection: currentSection.sys.id,
        idSubsection: currentSubsection ? currentSubsection.sys.id : null,
      });
    } else if (currentSection && !currentSection.fields.items) {
      this.setState({
        articlesArray: [],
        idSection: currentSection.sys.id,
        idSubsection: null,
      });
    }
  }

  componentDidMount() {
    const { updateBookmarksBlockArticles } = this.props.globalStore!;

    this.changeArticlesArray();
    updateBookmarksBlockArticles(true);
  }

  componentDidUpdate(prevProps: ISideMenuContainerProps, prevState: ISideMenuContainerState) {
    const { currentSubsection, currentSection } = this.props.globalStore!;

    if (
      (currentSubsection &&
        ((this.state.idSubsection && this.state.idSubsection !== currentSubsection.sys.id) ||
          (!this.state.idSubsection && currentSubsection.sys.id))) ||
      (currentSection && this.state.idSection !== currentSection.sys.id)
    ) {
      this.changeArticlesArray();
    } else if (
      currentSection &&
      !currentSubsection &&
      prevState.idSection &&
      prevState.idSection !== currentSection.sys.id
    ) {
      this.changeArticlesArray();
    }
  }

  render() {
    const {
      blocks,
      currentBlock,
      currentMarket,
      currentSection,
      currentSubsection,
      articlesBlock,
      articlesMarket,
      changeCurrentArticle,
      changeCurrentSection,
      changeCurrentSubsection,
      currentArticle,
      bookmarks,
      updateBookmarksApi,
      isBookmarkBlock,
      enableTabBookmark,
      bookmarksBlockArticles,
      bookmarksMarketArticles,
      isBookmarkAll,
      enableChanging,
      linkToContent,
    } = this.props.globalStore!;
    let isSelectedBookmark = false;

    if (bookmarks && !isBookmarkAll) {
      isSelectedBookmark = bookmarks.some(
        (bookmark: TBookmark) =>
          currentBlock &&
          currentMarket &&
          bookmark.idBlock === currentBlock.sys.id &&
          bookmark.idMarket === currentMarket!.id
      );
    }

    const classesBookmarkPage = cn('bookmark-link', {
      ['bookmark-link--active']: isBookmarkBlock,
    });

    let bookmarksArticlesGeneral = null;

    if (isBookmarkAll && articlesMarket && bookmarksMarketArticles.length) {
      bookmarksArticlesGeneral = bookmarksMarketArticles;
    } else if (isBookmarkBlock && articlesBlock && bookmarksBlockArticles.length) {
      bookmarksArticlesGeneral = bookmarksBlockArticles;
    }

    return (
      <div className="side-menu">
        {!isBookmarkAll ? (
          <Resizable
            defaultSize={{
              width: 208,
              height: '100%',
            }}
            minHeight={'100%'}
            minWidth={208}
            maxWidth={312}
            enable={{
              right: true,
            }}
          >
            <Scrollbars className="sidemenu-scroll-container">
              <div className="side-panel">
                <div className="side-panel__title">{currentBlock && currentBlock.fields.name}</div>
                <div className="side-panel__sections">
                  {currentBlock &&
                    currentBlock.fields.sections.map((section: Entry<any>, index: number) => {
                      const baseClass = 'side-panel-section';
                      const isOpenedSection =
                        section.fields.items &&
                        this.state.openedSections.some(
                          (idString: string) => idString === section.sys.id
                        );

                      let subsectionsData: Entry<any>[] = [];

                      if (
                        section &&
                        section.fields &&
                        section.fields.items &&
                        section.fields.items.length
                      ) {
                        section.fields.items.forEach((subsection: Entry<any>) => {
                          if (
                            subsection.fields &&
                            subsection.fields.name &&
                            subsection.fields.items &&
                            subsection.fields.items.length
                          ) {
                            subsectionsData.push(subsection);
                          }
                        });
                      }

                      const subsections =
                        subsectionsData && subsectionsData.length ? (
                          <div className={`${baseClass}__sections`}>
                            {subsectionsData.map((subsection: Entry<any>) => {
                              const baseClass = 'side-panel-subsection';
                              const classes = cn(baseClass, {
                                [baseClass + '--active']:
                                  currentSubsection &&
                                  currentSection &&
                                  currentSection.sys.id === section.sys.id &&
                                  currentSubsection.sys.id === subsection.sys.id,
                              });
                              const nameSubsection = subsection.fields && subsection.fields.name;
                              const subsectionObject: TSubsection = {
                                idSection: section.sys.id,
                                ...subsection,
                              };

                              return (
                                <div
                                  key={`subsection-${subsection.sys.id}`}
                                  className={classes}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    enableChanging();
                                    changeCurrentSubsection(subsectionObject, section);
                                    window.location.hash = '';
                                    setTimeout(() => {
                                      window.location.hash = `${currentBlock.sys.id}-${section.sys.id}-${subsectionObject.sys.id}-${subsectionObject.fields.items[0].sys.id}`;
                                    }, 300);
                                  }}
                                >
                                  <div className={`${baseClass}__title`}>{nameSubsection}</div>
                                </div>
                              );
                            })}
                          </div>
                        ) : null;

                      const classes = cn(baseClass, {
                        [baseClass + '--active']:
                          currentSection && currentSection.sys.id === section.sys.id,
                        [baseClass + '--opened']: isOpenedSection,
                      });

                      if (section.fields.items && section.fields.items.length) {
                        return (
                          <div
                            key={`section-${section.sys.id}`}
                            className={classes}
                            onClick={(event) => {
                              event.preventDefault();
                              enableChanging();
                              changeCurrentSection(section);
                              const subSectionId =
                                section &&
                                section.fields &&
                                section.fields.items &&
                                section.fields.items[0].fields.items
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
                                window.location.hash = `${currentBlock.sys.id}-${section.sys.id}-${subSectionId}${articleId}`;
                              }, 300);
                            }}
                          >
                            <div className={`${baseClass}__title`}>
                              <Conditional render={!!subsections}>
                                <div
                                  className={`${baseClass}__icon`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    this.openSubsectionHandler(section.sys.id);
                                  }}
                                >
                                  <Icon name="arrow-right-small" />
                                </div>
                              </Conditional>
                              {section.fields.name}
                            </div>
                            {subsections}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                </div>
                <div className="side-panel__other-blocks">
                  {blocks.map((block: Entry<any>, index: number) => {
                    if (
                      currentBlock &&
                      block.fields &&
                      block.fields.name &&
                      block.sys.id !== currentBlock.sys.id
                    ) {
                      let sectionsArray: Entry<any>[] = [];

                      if (block.fields.sections) {
                        block.fields.sections.forEach((section: Entry<any>) => {
                          if (section.fields.items) {
                            sectionsArray.push(section);
                          }
                        });
                      }
                      return sectionsArray && sectionsArray.length ? (
                        <button
                          key={`other-block-${index}`}
                          className="side-panel__title"
                          onClick={(event) => {
                            event.preventDefault();

                            let sectionsArray: Entry<any>[] = [];

                            if (block.fields.sections) {
                              block.fields.sections.forEach((section: Entry<any>) => {
                                if (section.fields.items) {
                                  sectionsArray.push(section);
                                }
                              });
                            }

                            const firstSection: Entry<any> | null =
                              sectionsArray && sectionsArray.length ? sectionsArray[0] : null;

                            linkToContent(firstSection, block);
                          }}
                        >
                          {block && block.fields.name}
                        </button>
                      ) : null;
                    }
                  })}
                </div>
                {bookmarksBlockArticles && bookmarksBlockArticles.length ? (
                  <div className="side-panel__bookmark">
                    <div
                      className={classesBookmarkPage}
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        enableTabBookmark();
                        if (bookmarksBlockArticles.length) {
                          changeCurrentArticle(bookmarksBlockArticles[0]);
                        }
                      }}
                    >
                      <Icon name="bookmark" selected={isSelectedBookmark} />
                      Закладки
                    </div>
                  </div>
                ) : null}
              </div>
            </Scrollbars>
          </Resizable>
        ) : null}
        {this.state.articlesArray.length || isBookmarkAll ? (
          <Resizable
            defaultSize={{
              width: 208,
              height: '100%',
            }}
            minHeight={'100%'}
            minWidth={208}
            maxWidth={312}
            enable={{
              right: true,
            }}
          >
            <div className="side-panel side-panel--articles">
              <div className="side-panel__sections">
                <Scrollbars id="sidemenu-scroll-container" className="sidemenu-scroll-container">
                  {!isBookmarkBlock &&
                  !isBookmarkAll &&
                  articlesBlock &&
                  this.state.articlesArray.length
                    ? this.state.articlesArray.map((articleState, index) => {
                        const article = articlesBlock.filter(
                          (articleBlock) =>
                            articleBlock.id === articleState.id &&
                            articleBlock.block!.sys.id === articleState.block!.sys.id &&
                            (articleBlock.subSection ? articleBlock.subSection.sys.id : '') ===
                              (articleState.subSection ? articleState.subSection.sys.id : '') &&
                            articleBlock.section &&
                            articleState.section &&
                            articleBlock.section.sys.id === articleState.section.sys.id &&
                            currentSection &&
                            currentSection.sys.id === articleState.section.sys.id &&
                            (currentSubsection ? currentSubsection.sys.id : '') ===
                              (articleState.subSection ? articleState.subSection.sys.id : '')
                        )[0];

                        if (article) {
                          const baseClass = 'side-panel-subsection';
                          const classes = cn(baseClass, {
                            [baseClass + '--active']:
                              (!currentSubsection &&
                                article.content &&
                                article.section &&
                                currentSection &&
                                currentArticle &&
                                article.content.id === currentArticle.id &&
                                article.section.sys.id === currentSection.sys.id) ||
                              (((currentSubsection &&
                                article.subSection &&
                                article.subSection.sys.id === currentSubsection.sys.id) ||
                                (currentSubsection && !article.subSection)) &&
                                article.content &&
                                article.section &&
                                currentSection &&
                                currentArticle &&
                                article.content.id === currentArticle.id &&
                                article.section.sys.id === currentSection.sys.id) ||
                              (!currentSubsection &&
                                !currentSection &&
                                isBookmarkBlock &&
                                currentArticle &&
                                article.content.id === currentArticle.id),
                          });
                          const name =
                            article.content && article.content.contentType === 'interview'
                              ? `${(article.content as TInterview).companyName}`
                              : article.content
                              ? (article.content as TThesis).title
                              : '';

                          const idBlock = article.block ? article.block.sys.id + '-' : '';
                          const idSection = article.section ? article.section.sys.id + '-' : '';
                          const idSubSection = article.subSection
                            ? article.subSection.sys.id + '-'
                            : '';
                          let isSelectedBookmark = false;

                          if (bookmarks) {
                            isSelectedBookmark = bookmarks.some(
                              (bookmark: TBookmark) =>
                                bookmark.idArticle === article.id &&
                                bookmark.idBlock === (article.block ? article.block.sys.id : '') &&
                                bookmark.idSubsection ===
                                  (article.subSection ? article.subSection.sys.id : '') &&
                                bookmark.idSection ===
                                  (article.section ? article.section.sys.id : '') &&
                                bookmark.idMarket === currentMarket!.id
                            );
                          }

                          const classesBookmark = cn(`${baseClass}__bookmark-button`, {
                            [`${baseClass}__bookmark-button--selected`]: isSelectedBookmark,
                          });

                          return (
                            <div
                              key={`block-${article.id}-${index}`}
                              className={classes}
                              onClick={() => {
                                enableChanging();
                                changeCurrentArticle(article);
                                this.setState({
                                  articlesArray: this.state.articlesArray,
                                });

                                window.location.hash = '';
                                setTimeout(() => {
                                  window.location.hash = `${idBlock}${idSection}${idSubSection}${article.id}`;
                                }, 300);
                              }}
                            >
                              <div className={`${baseClass}__title`}>{name}</div>
                              <button
                                className={classesBookmark}
                                onClick={(event) => {
                                  event.stopPropagation();

                                  const updatedBookmarks = toggleBookmark(
                                    article,
                                    article.block!.sys.id,
                                    currentMarket!.id,
                                    bookmarks
                                  );

                                  if (updatedBookmarks.deletedBookmark) {
                                    updateBookmarksApi(
                                      updatedBookmarks.items,
                                      updatedBookmarks.deletedBookmark
                                    );
                                  } else {
                                    updateBookmarksApi(updatedBookmarks.items);
                                  }
                                }}
                              >
                                <Icon name="bookmark" selected={isSelectedBookmark} />
                              </button>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })
                    : null}
                  {bookmarksArticlesGeneral && bookmarksArticlesGeneral.length
                    ? bookmarksArticlesGeneral.map((articleBookmark, index) => {
                        const baseClass = 'side-panel-subsection';
                        const classes = cn(baseClass, {
                          [baseClass + '--active']:
                            currentArticle &&
                            currentArticle.block &&
                            currentArticle.section &&
                            articleBookmark.block &&
                            articleBookmark.content &&
                            articleBookmark.section &&
                            articleBookmark.block.sys.id === currentArticle.block.sys.id &&
                            articleBookmark.content.id === currentArticle.id &&
                            articleBookmark.section.sys.id === currentArticle.section.sys.id &&
                            ((currentArticle.subSection &&
                              articleBookmark.subSection &&
                              articleBookmark.subSection.sys.id ===
                                currentArticle.subSection.sys.id) ||
                              (!currentArticle.subSection && !articleBookmark.subSection)),
                        });
                        const name =
                          articleBookmark.content &&
                          articleBookmark.content.contentType === 'interview'
                            ? `${(articleBookmark.content as TInterview).respondentName}, ${
                                (articleBookmark.content as TInterview).companyName
                              }`
                            : articleBookmark.content
                            ? (articleBookmark.content as TThesis).title
                            : '';

                        const idBlock = articleBookmark.block
                          ? articleBookmark.block.sys.id + '-'
                          : '';
                        const idSection = articleBookmark.section
                          ? articleBookmark.section.sys.id + '-'
                          : '';
                        const idSubSection = articleBookmark.subSection
                          ? articleBookmark.subSection.sys.id + '-'
                          : '';

                        return (
                          <div
                            key={`bookmark-block-${articleBookmark.id}-${index}`}
                            className={classes}
                            onClick={() => {
                              changeCurrentArticle(articleBookmark);
                              this.setState({
                                articlesArray: this.state.articlesArray,
                              });
                              window.location.hash = '';
                              setTimeout(() => {
                                window.location.hash = `${idBlock}${idSection}${idSubSection}${articleBookmark.id}`;
                              }, 300);
                            }}
                          >
                            <div className={`${baseClass}__title`}>{name}</div>
                          </div>
                        );
                      })
                    : null}
                </Scrollbars>
              </div>
            </div>
          </Resizable>
        ) : null}
      </div>
    );
  }
}

export default SideMenuContainer;
