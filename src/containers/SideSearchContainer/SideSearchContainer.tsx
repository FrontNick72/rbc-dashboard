import React from 'react';
import cn from 'classnames';
import './SideSearchContainer.scss';
import SearchBoxContainer from '../SearchBoxContainer';
import Scrollbars from 'react-custom-scrollbars';
import ArticleShort from '../../components/ArticleShort';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { TArticle } from '../../App';

interface ISideSearchContainerState {}

interface ISideSearchContainerProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class SideSearchContainer extends React.Component<
  ISideSearchContainerProps,
  ISideSearchContainerState
> {
  state: ISideSearchContainerState = {};

  render() {
    const baseClass = 'side-search-container';
    const {
      searchArticles,
      articlesMarket,
      currentArticle,
      changeCurrentArticle,
    } = this.props.globalStore!;

    return (
      <div className={baseClass}>
        <div className={baseClass + '__top-string'}>
          <SearchBoxContainer
            isSearchPage
            classSearch="searchbox--side-search"
            classLine="searchbox__line--side-search"
          ></SearchBoxContainer>
        </div>
        <Scrollbars id="side-search-scroll-container" className={baseClass + '__scroll-articles'}>
          {articlesMarket && searchArticles && searchArticles.length
            ? searchArticles.map((idArticle: string, index) => {
                const articleData: TArticle = articlesMarket.filter(
                  (marketArticle) => marketArticle.id === idArticle
                )[0];
                const classes = cn(baseClass + '__result-item', {
                  [`${baseClass}__result-item--active`]: currentArticle
                    ? currentArticle.id === idArticle
                    : false,
                });
                const idBlock = articleData.block ? articleData.block.sys.id + '-' : '';
                const idSection = articleData.section ? articleData.section.sys.id + '-' : '';
                const idSubSection = articleData.subSection
                  ? articleData.subSection.sys.id + '-'
                  : '';

                const hash = `${idBlock}${idSection}${idSubSection}${articleData.id}`;

                if (articleData) {
                  return (
                    <div
                      key={`article-search-${index}-${articleData.id}`}
                      className={classes}
                      onClick={() => {
                        changeCurrentArticle(articleData, false, hash);
                      }}
                    >
                      <ArticleShort contentData={articleData} isText></ArticleShort>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            : null}
        </Scrollbars>
      </div>
    );
  }
}

export default SideSearchContainer;
