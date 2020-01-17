import React from 'react';
import './SearchBoxContainer.scss';
import SearchBox from '../../components/SearchBox/SearchBox';
import Icon from '../../components/Icon';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';

interface ISearchBoxContainerProps {
  isSearchPage?: boolean;
  classSearch: string;
  classLine: string;
  globalStore?: GlobalStore;
}

interface ISearchBoxContainerState {
  isOpenedSearch: boolean;
}

@inject('globalStore')
@observer
class SearchBoxContainer extends React.Component<
  ISearchBoxContainerProps,
  ISearchBoxContainerState
> {
  state: ISearchBoxContainerState = {
    isOpenedSearch: false,
  };

  searchBoxRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      if (this.searchBoxRef.current && !this.searchBoxRef.current.contains(target as Node)) {
        this.toggleSearchBox(true);
      }
    });
  }

  toggleSearchBox = (isOut?: boolean) => {
    this.setState((prevState) => {
      if (prevState.isOpenedSearch !== !this.state.isOpenedSearch) {
        return {
          isOpenedSearch: isOut ? false : !this.state.isOpenedSearch,
        };
      } else {
        return null;
      }
    });
  };

  render() {
    const baseClass = 'search-string-container';
    const { isSearchPage, classSearch, classLine } = this.props;
    const { searchArticles } = this.props.globalStore!;
    const isOpen = !isSearchPage ? this.state.isOpenedSearch : true;

    return (
      <div className={baseClass}>
        <div ref={this.searchBoxRef} className={baseClass + '__general'}>
          <SearchBox
            opened={isOpen}
            callbackToggle={this.toggleSearchBox}
            isSearchPage={isSearchPage}
            classSearch={classSearch}
            classLine={classLine}
          ></SearchBox>
          <button
            className={baseClass + '__search-button'}
            onClick={
              !isSearchPage
                ? (event) => {
                    event.stopPropagation();
                    this.toggleSearchBox();
                  }
                : () => {}
            }
          >
            <Icon name="search" selected={isOpen} />
          </button>
        </div>
        {isSearchPage && searchArticles ? (
          <div className={baseClass + '__finding'}>Найдено {searchArticles.length} результатов</div>
        ) : null}
      </div>
    );
  }
}

export default SearchBoxContainer;
