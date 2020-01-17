import React from 'react';
import './TopbarContainer.scss';
import logo from '../../assets/svg/logo.svg';
import Icon from '../../components/Icon';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { Link } from 'react-router-dom';
import SearchBoxContainer from '../SearchBoxContainer';

interface ITopbarContainerProps {
  globalStore?: GlobalStore;
}

interface ITopbarContainerState {
  isOpenedSearch: boolean;
}

@inject('globalStore')
@observer
class TopbarContainer extends React.Component<ITopbarContainerProps, ITopbarContainerState> {
  state: ITopbarContainerState = {
    isOpenedSearch: false,
  };

  toggleSearchBox = () => {
    this.setState((prevState) => {
      if (prevState.isOpenedSearch !== !this.state.isOpenedSearch) {
        return {
          isOpenedSearch: !this.state.isOpenedSearch,
        };
      } else {
        return null;
      }
    });
  };

  render() {
    const {
      currentSegment,
      currentBlock,
      currentMarket,
      isBookmarkBlock,
      isBookmarkAll,
      enableBookmarksAll,
      bookmarksMarketArticles,
      isSearchPage,
      changeCurrentMarket,
      isAuthenticated,
    } = this.props.globalStore!;

    const segmetnPath = currentSegment ? `/ ${currentSegment.name}` : '';
    const blockPath = currentBlock ? `/ ${currentBlock.fields.name}` : '';
    const bookmarkPath = isBookmarkBlock || isBookmarkAll ? '/ Закладки' : '';
    const marketPath = currentMarket ? `${currentMarket.name} ` : '';
    const searchPath = isSearchPage ? '/ Поиск' : '';

    return (
      <div className="topbar">
        <div className="topbar__title-logo">
          <span>
            <img src={logo} alt="logo"></img>
          </span>
        </div>
        <div className="topbar__body">
          <div className="topbar__title">
            <div className="topbar__title-label">
              {isAuthenticated ? (
                <>
                  <Link to="/">
                    <button
                      className="topbar__route"
                      onClick={() => changeCurrentMarket(currentMarket!.id)}
                    >
                      {marketPath}
                    </button>
                  </Link>
                  {segmetnPath}
                  {blockPath}
                  {bookmarkPath}
                  {searchPath}
                </>
              ) : (
                'РБК исследования'
              )}
            </div>
          </div>
          {isAuthenticated ? (
            <div className="topbar__links">
              <div className="topbar__link">
                <SearchBoxContainer
                  isSearchPage={false}
                  classSearch="searchbox--top-bar"
                  classLine="searchbox__line--top-bar"
                />
              </div>
              {bookmarksMarketArticles && bookmarksMarketArticles.length ? (
                <div className="topbar__link">
                  <Link
                    className="topbar__bookmark"
                    onClick={enableBookmarksAll}
                    to={'/content/bookmarks/'}
                  >
                    <Icon name="bookmark" selected={isBookmarkAll} />
                  </Link>
                </div>
              ) : null}
              {/* <div className="topbar__link">
              <a className="topbar__notification" href="3">
                <Icon name="notification" />
              </a>
            </div> */}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default TopbarContainer;
