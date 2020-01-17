import React, { createRef, ChangeEvent } from 'react';
import './SearchBox.scss';
import cn from 'classnames';
import Scene from 'scenejs';
import Icon from '../Icon';
import ArticleShort from '../ArticleShort/ArticleShort';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import changeLastRequest from '../../utils/changeLastRequest';
import { TLastRequest } from 'dashboards/types';
import { TArticle } from '../../App';
import throttle from '../../utils/throttle.js';

interface ISearchBoxState {}

interface ISearchBoxProps extends RouteComponentProps {
  opened?: boolean;
  callbackToggle?: () => void;
  isSearchPage?: boolean;
  globalStore?: GlobalStore;
  classSearch: string;
  classLine: string;
}

@inject('globalStore')
@observer
class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState> {
  state: ISearchBoxState = {};
  inputSearchRef = createRef<HTMLInputElement>();
  keyframe: { [key: string]: {} } = {};
  scene = new Scene();
  throttleFetch = throttle(this.props.globalStore!.fetchSlugArticles, 1000);

  componentDidMount() {
    const { isSearchPage, opened, classSearch, classLine } = this.props;
    const { currentSearchString } = this.props.globalStore!;

    this.keyframe[`.${classSearch}`] = {
      '0%': 'width: 0',
      '70%': 'width: 504px',
    };
    this.keyframe[`.${classLine}`] = {
      '30%': 'width: 0%',
      '100%': 'width: 100%',
    };

    this.scene = new Scene(this.keyframe, {
      duration: 1,
      easing: 'ease-in-out',
      direction: 'normal',
      selector: true,
    }).exportCSS();

    this.scene.setTime(0);

    const node = this.inputSearchRef.current;

    if (node !== null && !opened) {
      node.value = '';
    }

    if (isSearchPage && node !== null) {
      node.value = currentSearchString;
    }
  }

  componentDidUpdate(prevProps: ISearchBoxProps, prevState: ISearchBoxState) {
    const { opened, isSearchPage } = this.props;

    if (opened !== prevProps.opened && isSearchPage === false) {
      this.scene.setDirection(opened ? 'normal' : 'reverse');
      this.scene.play();
    }
  }

  goToArticle = (articleData: TArticle) => {
    const { changeCurrentBlock } = this.props.globalStore!;

    if (this.props.callbackToggle) {
      this.props.callbackToggle();
    }

    this.props.history.push('/content');
    changeCurrentBlock(articleData.block, articleData, true);
    this.clearHandler();
  };

  clearHandler = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, isDelete?: boolean) => {
    const { setSearchArticles } = this.props.globalStore!;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const node = this.inputSearchRef.current;
    if (node !== null) {
      node.value = '';
      node.blur();

      if (isDelete) {
        setSearchArticles([]);
      }
    }
  };

  handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { setCurrentSearchString } = this.props.globalStore!;
    const value: string = event.currentTarget.value;
    setCurrentSearchString(value);
    this.throttleFetch(value);
  };

  clickHandler = (isLastRequest?: TLastRequest) => {
    const {
      pushLastRequest,
      lastRequest,
      setCurrentSearchString,
      currentSearchString,
      enableSearchPage,
    } = this.props.globalStore!;

    if (this.props.callbackToggle) {
      this.props.callbackToggle();
    }

    const node = this.inputSearchRef.current;

    if (node && !isLastRequest) {
      pushLastRequest(
        changeLastRequest(`last-request-${(+new Date()).toString(16)}`, node.value, lastRequest)
      );
    }

    if (isLastRequest) {
      setCurrentSearchString(isLastRequest.request);
      this.throttleFetch(isLastRequest.request);
    } else {
      this.throttleFetch(currentSearchString);
    }

    // setFocus(false);
    this.clearHandler();
    enableSearchPage();

    this.props.history.push('/content');
  };

  render() {
    const baseClass = 'searchbox';
    const baseClassPopup = 'searchbox-popup';
    const { opened, isSearchPage, classSearch, classLine } = this.props;
    const {
      currentSearchString,
      lastRequest,
      pushLastRequest,
      lastRequestArticles,
      searchArticles,
      articlesMarket,
    } = this.props.globalStore!;
    // const [focus, setFocus] = useState(false);

    const classesClose = cn(baseClass + '__close', {
      [`${baseClass}__close--open`]: opened,
    });

    let searchShortArticles: TArticle[] = [];

    if (
      this.inputSearchRef &&
      this.inputSearchRef.current &&
      this.inputSearchRef.current.value &&
      articlesMarket &&
      searchArticles &&
      searchArticles.length
    ) {
      searchArticles.forEach((idArticle, index) => {
        const articleData: TArticle = articlesMarket.filter(
          (marketArticle) => marketArticle.id === idArticle
        )[0];

        if (articleData) {
          searchShortArticles.push(articleData);
        }
      });
    }

    return (
      <div className="searchbox-container">
        <form
          className={baseClass + ' ' + classSearch}
          onSubmit={(event) => {
            event.preventDefault();
            this.clickHandler();
          }}
        >
          <input
            type="text"
            ref={this.inputSearchRef}
            // onFocus={() => setFocus(true)}
            // onBlur={() => setFocus(false)}
            onChange={this.handleChange}
          />
          <button className={baseClass + '__submit'}>
            <Icon name="search" />
          </button>
          <div className={`${baseClass}__line ${classLine}`}></div>
          <button className={classesClose} onClick={(event) => this.clearHandler(event, true)}>
            <Icon name="close" />
          </button>
        </form>
        {opened && !isSearchPage ? (
          <div className={baseClassPopup}>
            {this.inputSearchRef &&
            this.inputSearchRef.current &&
            this.inputSearchRef.current.value ? (
              <button
                className={baseClassPopup + '__top-string'}
                onClick={() => this.clickHandler()}
              >
                <Icon name="search" />
                <div>
                  Искать по запросу «<span>{currentSearchString}</span>»
                </div>
              </button>
            ) : null}
            <div className={baseClassPopup + '__result'}>
              {searchShortArticles && searchShortArticles.length
                ? searchShortArticles.map((articleData: TArticle, index) => {
                    if (articleData && index < 3) {
                      return (
                        <div
                          key={`article-short-${index}-${articleData.id}`}
                          className={baseClassPopup + '__result-item'}
                          onClick={() => this.goToArticle(articleData)}
                        >
                          <ArticleShort contentData={articleData}></ArticleShort>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                : lastRequestArticles.length
                ? lastRequestArticles.map((request: TLastRequest, index) => {
                    return (
                      <div key={request.idRequest} className={baseClassPopup + '__result-item'}>
                        <div
                          className={baseClassPopup + '__recent-search'}
                          onClick={() => this.clickHandler(request)}
                        >
                          <Icon name="history" />
                          <span>{request.request}</span>
                          <button
                            className={baseClassPopup + '__grab-recent'}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              pushLastRequest(
                                changeLastRequest(request.idRequest, request.request, lastRequest)
                              );
                            }}
                          >
                            <Icon name="delete" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(SearchBox);
