import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from 'components/AppBar';
import WallPage from 'components/WallPage';
import MapPage from 'components/MapPage';
import ChatsPage from 'components/ChatsPage';
import NotFoundPage from 'components/NotFoundPage';
import configureStore from 'store/configureStore';

const initialState = {
  clientId: '',
  nickname: '',
  messages: [
    {
      id: 'first',
      clientId: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message',
      isOwn: false
    }
  ],
  whoIsTyping: '',
  websocketStatus: 'CLOSED'
};

const store = configureStore(initialState);

// store.subscribe(() => console.log('New state from store: ', store.getState()));

const routes = (
  <Router>
    <div>
      <AppBar />
      <Switch>
        <Route component={WallPage} exact path="/" />
        <Route component={MapPage} path="/map" />
        <Route component={ChatsPage} path="/chats" />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

const Top = props => (
  <Provider store={store}>
    {routes}
  </Provider>
);

export default Top;
