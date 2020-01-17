import React, { UIEvent } from 'react';
import cn from 'classnames';
import SideMenuContainer from '../../containers/SideMenuContainer';
import './ContentView.scss';
import ContentContainer from '../../containers/ContentContainer';
import Scrollbars from 'react-custom-scrollbars';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import SideSearchContainer from '../../containers/SideSearchContainer';
import Button from '../../components/Button';

interface IContentViewState {
  scrollTopMeta: number;
}

interface IContentViewProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class ContentView extends React.Component<IContentViewProps, IContentViewState> {
  state = {
    scrollTopMeta: 0,
  };

  handleScroll = (event: UIEvent<any>) => {
    const target = event.target as HTMLElement;

    this.setState((prevState) => {
      if (prevState.scrollTopMeta !== target.scrollTop) {
        return { scrollTopMeta: target.scrollTop };
      } else {
        return null;
      }
    });
  };

  render() {
    const { isSearchPage, currentArticle, changeCurrentBlock } = this.props.globalStore!;
    const classesContainer = cn('content-container-general', {
      [`content-container-general--is-search`]: isSearchPage,
    });

    return (
      <div className="content-view">
        {!isSearchPage ? (
          <SideMenuContainer></SideMenuContainer>
        ) : (
          <SideSearchContainer></SideSearchContainer>
        )}
        <div className={classesContainer}>
          <Scrollbars id="content-scroll-container" onScroll={(event) => this.handleScroll(event)}>
            <ContentContainer scrollTopMeta={this.state.scrollTopMeta}></ContentContainer>
          </Scrollbars>
          {isSearchPage && currentArticle ? (
            <Button
              onClick={() => changeCurrentBlock(currentArticle.block, currentArticle, true)}
              className={'content-container-general__route-to'}
              color={'yellow-dark'}
              checked
              label={'Перейти к материалу'}
            ></Button>
          ) : null}
        </div>
      </div>
    );
  }
}
export default ContentView;
