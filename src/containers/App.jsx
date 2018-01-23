import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppBar from 'components/AppBar';
import Chats from 'components/Chats';
import Profile from 'components/Profile';
import Settings from 'components/Settings';
import NotFound from 'components/NotFound';
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
        <Route component={Chats} exact path="/" />
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
