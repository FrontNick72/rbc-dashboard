import React from 'react';
import './styles/main.scss';
import './App.scss';
import TopbarContainer from './containers/TopbarContainer';
import SidebarContainer from './containers/SidebarContainer';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import MarketView from './views/MarketView';
import ContentView from './views/ContentView';
import { Entry, Sys } from 'contentful';
import { observer, inject } from 'mobx-react';
import GlobalStore from './store/GlobalStore';
import { TArticleContent, TBlock } from 'dashboards/types';
import AuthView from './views/AuthView';
import ProfileView from './views/ProfileView';
import { NotificationContainer } from './components/Notification';

export interface TMarket {
  id: string;
  name: string;
  segments: (Entry<TSegment> & { checked: boolean })[] | null;
  blocks: Entry<TBlock>[] | null;
}

export interface TArticle {
  id: string;
  block: Entry<TBlock> | null;
  segment: Entry<TSegment> | null;
  section: Entry<any> | null;
  subSection: TSubsection | null;
  content: TArticleContent;
  path?: string;
  pathHash?: string;
}

export interface TSubsection {
  idSection: string;
  fields: any;
  sys: Sys;
}

export interface TSegment {
  id: string;
  block: Entry<any>[];
  name: string;
}

interface IAppState {
  markets: TMarket[];
}
interface IAppProps extends RouteComponentProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class App extends React.Component<IAppProps, IAppState> {
  async componentDidMount() {
    const { isAuthenticated, authenticate } = this.props.globalStore!;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!isAuthenticated && token && userId) {
      authenticate(false, undefined, userId, token);
      return;
    }
  }

  render() {
    const {
      isAuthenticated,
      currentBlock,
      currentSection,
      isBookmarkAll,
      isSearchPage,
      bookmarksMarketArticles,
    } = this.props.globalStore!;

    const mainRedirect =
      (!currentBlock && !currentSection && !isBookmarkAll && !isSearchPage) ||
      (isBookmarkAll && !bookmarksMarketArticles.length) ? (
        <Redirect to="/" />
      ) : null;

    const view = isAuthenticated ? (
      <Switch>
        <Route path="/change-password">
          <AuthView change />
        </Route>
        <Route path="/profile">
          <ProfileView></ProfileView>
        </Route>
        <Route path="/" exact>
          <MarketView></MarketView>
        </Route>
        {mainRedirect}
        <Route path="/content">
          <ContentView></ContentView>
        </Route>
        <Route exact path="/content/bookmarks">
          <ContentView></ContentView>
        </Route>
      </Switch>
    ) : (
      <Switch>
        <Route path="/change-password">
          <AuthView change />
        </Route>
        <Route path="/login">
          <AuthView />
        </Route>
        <Redirect to="/login"></Redirect>
      </Switch>
    );

    return (
      <div className="app">
        <TopbarContainer></TopbarContainer>
        <div className="app-body">
          <SidebarContainer></SidebarContainer>
          <div className="app-body__wrapper">
            <div className="app-body__content-container">{view}</div>
          </div>
          <NotificationContainer />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
