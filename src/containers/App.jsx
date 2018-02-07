import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import configureStore from 'store/configureStore';

import AppBar from 'components/AppBar';
// import Home from 'components/Home';
import Profile from 'components/Profile';
import Settings from 'components/Settings';
import NotFound from 'components/NotFound';
import ChatContainer from './ChatContainer';
import ChatsContainer from './ChatsContainer';

const initialState = {
  clientId: '',
  nickname: '',
  chats: [
    // {
    //   id: 'tfhn523'
    // },
    // {
    //   id: 'bpxv98'
    // }
  ],
  messages: [
    {
      id: 'first',
      clientId: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message',
      isOwn: false,
      status: 'SENT' // must be not viewed as not own
    },
    {
      id: 'scnd',
      clientId: 'wdadr27408908',
      nickname: 'Like Me',
      text: 'Whatever You want',
      isOwn: true,
      status: 'UNSENT'
    }
  ],
  whoIsTyping: ''
};

const store = configureStore(initialState);

// store.subscribe(() => console.log('New state from store: ', store.getState()));

const routes = (
  <Router>
    <div className="root-container">
      <AppBar />
      <Switch>
        <Route component={ChatsContainer} exact path="/" />
        {/* For wide screen layout: */}
        {/* <Route component={ChatsContainer} exact path="/chats/:chatId" /> */}
        <Route component={ChatContainer} path="/chat/:chatId" />
        <Route component={Profile} path="/profile" />
        <Route component={Settings} path="/settings" />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

const App = props => (
  <Provider store={store}>
    {routes}
  </Provider>
);

export default App;
