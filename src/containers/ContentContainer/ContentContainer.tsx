import React from 'react';
import './ContentContainer.scss';
import InterviewContainer from '../InterviewContainer';
import VisibilitySensor from 'react-visibility-sensor';
import ThesisContainer from '../ThesisContainer';
import DigitalContainer from '../DigitalContainer';
import GlobalStore from '../../store/GlobalStore';
import { inject, observer } from 'mobx-react';
import { TArticle } from '../../App';
import SubHeader from '../../components/SubHeader';

interface IContentContainerState {
  articlesVisibles: number[];
  currentArticles: TArticle[];
  getElement: HTMLElement | null;
}

interface IContentContainerProps {
  scrollTopMeta: number;
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class ContentContainer extends React.Component<IContentContainerProps, IContentContainerState> {
  state: IContentContainerState = {
    articlesVisibles: [],
    currentArticles: [],
    getElement: document.getElementById('content-scroll-container'),
  };

  pushArticles = (isVisible: boolean, index: number) => {
    const { articlesVisibles } = this.state;

    if (isVisible && articlesVisibles.indexOf(index + 1) === -1) {
      this.setState({ articlesVisibles: [...articlesVisibles, index + 1] });
    }
  };

  componentDidMount() {
    const { articlesBlock, articlesMarket, searchArticles, isSearchPage } = this.props.globalStore!;

    if (
      articlesBlock &&
      articlesBlock.length &&
      this.state.articlesVisibles.length === 0 &&
      !isSearchPage
    ) {
      let arrayVisibles: number[] = [];

      articlesBlock.forEach((article: TArticle, index: number) => {
        if (index <= 2) {
          arrayVisibles.push(index);
        }
      });

      this.setState({
        getElement: document.getElementById('content-scroll-container'),
        currentArticles: articlesBlock,
        articlesVisibles: arrayVisibles,
      });
    }

    if (
      isSearchPage &&
      searchArticles &&
      articlesMarket &&
      searchArticles.length &&
      articlesMarket.length
    ) {
      const articlesSearch: TArticle[] = [];

      searchArticles.forEach((idArticle) => {
        const articleData: TArticle = articlesMarket.filter(
          (marketArticle) => marketArticle.id === idArticle
        )[0];

        if (articleData) {
          articlesSearch.push(articleData);
        }
      });

      let arrayVisibles: number[] = [];

      articlesSearch.forEach((article: TArticle, index: number) => {
        if (index <= 2) {
          arrayVisibles.push(index);
        }
      });

      this.setState({
        getElement: document.getElementById('content-scroll-container'),
        currentArticles: articlesSearch,
        articlesVisibles: arrayVisibles,
      });
    } else if (isSearchPage) {
      this.setState({
        getElement: document.getElementById('content-scroll-container'),
        currentArticles: [],
        articlesVisibles: [0, 1, 2],
      });
    }
  }

  componentDidUpdate() {
    const {
      isSearchPage,
      articlesBlock,
      currentArticle,
      isChanging,
      disableChanging,
    } = this.props.globalStore!;

    if (
      articlesBlock &&
      articlesBlock.length &&
      !isSearchPage &&
      articlesBlock.length !== this.state.currentArticles.length
    ) {
      let arrayVisibles: number[] = [];

      articlesBlock.forEach((article: TArticle, index: number) => {
        if (index <= 2) {
          arrayVisibles.push(index);
        }
      });

      this.setState({
        getElement: document.getElementById('content-scroll-container'),
        currentArticles: articlesBlock,
        articlesVisibles: arrayVisibles,
      });
    } else if (
      articlesBlock &&
      !articlesBlock.length &&
      articlesBlock.length !== this.state.currentArticles.length
    ) {
      this.setState({
        getElement: document.getElementById('content-scroll-container'),
        currentArticles: [],
        articlesVisibles: [],
      });
    }

    const indexArticle = this.state.currentArticles.findIndex(
      (article) =>
        currentArticle &&
        currentArticle.content.id === article.content.id &&
        currentArticle.block &&
        currentArticle.section &&
        article.section &&
        currentArticle.section.sys.id === article.section.sys.id
    );

    if ((indexArticle || indexArticle === 0) && indexArticle !== -1 && isChanging) {
      const updatedArticlesVisibles = new Array(indexArticle + 3).fill(0).map((el, index) => index);

      if (updatedArticlesVisibles.length !== this.state.articlesVisibles.length) {
        this.setState({ articlesVisibles: updatedArticlesVisibles });
      }

      disableChanging();
    }
  }

  render() {
    let containmentDOMRect = this.state.getElement
      ? this.state.getElement
      : document.getElementById('content-scroll-container');
    const {
      currentArticle,
      changeCurrentArticle,
      isBookmarkBlock,
      isBookmarkAll,
      searchArticles,
      articlesMarket,
      isSearchPage,
      bookmarksMarketArticles,
      bookmarksBlockArticles,
      isChanging,
    } = this.props.globalStore!;

    let articlesGeneral = this.state.currentArticles;

    if (isSearchPage && searchArticles && articlesMarket && searchArticles.length) {
      const articlesSearch: TArticle[] = [];

      searchArticles.forEach((idArticle) => {
        const articleData: TArticle = articlesMarket.filter(
          (marketArticle) => marketArticle.id === idArticle
        )[0];

        if (articleData) {
          articlesSearch.push(articleData);
        }
      });
      articlesGeneral = articlesSearch;
    }

    if (isBookmarkBlock && bookmarksBlockArticles && bookmarksBlockArticles.length) {
      articlesGeneral = bookmarksBlockArticles;
    }

    if (isBookmarkAll && bookmarksMarketArticles && bookmarksMarketArticles.length) {
      articlesGeneral = bookmarksMarketArticles;
    }

    return articlesGeneral.length ? (
      <div className="content-container">
        {articlesGeneral.map((article, index) => {
          return containmentDOMRect ? (
            <VisibilitySensor
              key={`${index}-article`}
              onChange={(isVisible) => {
                this.pushArticles(isVisible, index);

                if (isVisible && !isChanging) {
                  changeCurrentArticle(article, true);
                }
              }}
              containment={containmentDOMRect}
              partialVisibility
              offset={{ top: 300, bottom: 300 }}
              minTopValue={100}
              intervalDelay={100}
              scrollCheck
              intervalCheck
              resizeCheck
            >
              {() => {
                const isVisibleArticle =
                  this.state.articlesVisibles.indexOf(index) !== -1 ||
                  (currentArticle && article.id === currentArticle.id);

                let containerArticle: Element | JSX.Element | null = null;

                if (
                  article.content &&
                  article.content.contentType &&
                  article.content.contentType === 'thesis'
                ) {
                  containerArticle = (
                    <ThesisContainer
                      key={`article-${article.id}`}
                      contentData={article}
                      scrollTopMeta={this.props.scrollTopMeta}
                    ></ThesisContainer>
                  );
                }

                if (
                  article.content &&
                  article.content.contentType &&
                  article.content.contentType === 'interview'
                ) {
                  // let questions =
                  //   (article.content as TInterview).interviewQuestion !== undefined
                  //     ? (article.content as TInterview).interviewQuestion
                  //     : [];

                  containerArticle = (
                    <InterviewContainer
                      key={`article-${article.id}`}
                      openedQuestion={[]}
                      contentData={article}
                      scrollTopMeta={this.props.scrollTopMeta}
                    ></InterviewContainer>
                  );
                }

                if (
                  article.content &&
                  article.content.contentType &&
                  article.content.contentType === 'digital'
                ) {
                  containerArticle = (
                    <DigitalContainer
                      key={`article-${article.id}`}
                      openedComment={false}
                      contentData={article}
                      scrollTopMeta={this.props.scrollTopMeta}
                    ></DigitalContainer>
                  );
                }

                if (isBookmarkBlock || isBookmarkAll || isSearchPage) {
                  return containerArticle;
                } else if (!isBookmarkBlock && !isBookmarkAll) {
                  return isVisibleArticle ? containerArticle : null;
                } else {
                  return null;
                }
              }}
            </VisibilitySensor>
          ) : null;
        })}
      </div>
    ) : (
      <div className="content-container content-container--empty">
        <SubHeader>Материалы не найдены</SubHeader>
      </div>
    );
  }
}

export default ContentContainer;
