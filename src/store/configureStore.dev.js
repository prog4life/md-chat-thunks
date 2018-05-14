import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import immutabilityWatcher from 'redux-immutable-state-invariant';
import freeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
import createWebsocketMiddleware from 'redux-mw-ws';
// import logger from 'redux-logger'; // to get logger mw with default options
import appReducer from 'reducers';
import * as actions from 'actions';

import createWebsocketHandler from 'middleware/websocketHandler';

// must be the last middleware in chain
const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    const hiddenTypes = [];
    return !hiddenTypes.some(type => type === action.type);
  }
});

// 1st - options, 2nd - reconnectCallback
const websocketMw = createWebsocketMiddleware({
  defaultEndpoint: 'ws://localhost:8787',
});

const websocketHandler = createWebsocketHandler(actions);

const watcher = immutabilityWatcher();

const middleware = process.env.NODE_ENV === 'development'
  ? [watcher, freeze, websocketHandler, websocketMw, thunk, logger]
  : [thunk];

const configureStore = (preloadedState = {}) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;

  return createStore(
    appReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );
};

export default configureStore;
