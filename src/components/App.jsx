import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hot, setConfig } from 'react-hot-loader';

// import AppBar from 'components/AppBar';
// import Home from 'components/Home';
import ChatsPage from 'components/ChatsPage';
import Profile from 'components/Profile';
import Settings from 'components/Settings';
import NotFound from 'components/NotFound';
import ChatContainer from 'containers/ChatContainer';
import ChatsContainer from 'containers/ChatsContainer';
import PublicWall from './PublicWall';

setConfig({ logLevel: 'error' }); // ['debug', 'log', 'warn', 'error'(default)]

const routes = (
  <Router>
    <div className="root-container">
      <Switch>
        <Route path="/" exact component={PublicWall} />
        <Route path="/chats" exact component={ChatsPage} />
        {/* For wide screen layout: */}
        <Route path="/chats/:chatId" component={ChatsPage} />
        {/* <Route path="/chat/:chatId" component={ChatContainer} /> */}
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

const App = ({ store }) => (
  <Provider store={store}>
    {routes}
  </Provider>
);

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

// export default hot(module)(App);
export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
