import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import immutabilityWatcher from 'redux-immutable-state-invariant';
import freeze from 'redux-freeze';
import socketIO from 'socket.io-client';
import { createLogger } from 'redux-logger';
// import logger from 'redux-logger'; // to get logger mw with default options
import appReducer from 'state/reducer';

// must be the last middleware in chain
const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    const hiddenTypes = [];
    return !hiddenTypes.some(type => type === action.type);
  },
});

const watcher = immutabilityWatcher();

const socket = socketIO('http://localhost:3000');
const thunkWithSocket = thunk.withExtraArgument(socket);

const middleware = process.env.NODE_ENV === 'development'
  ? [watcher, freeze, thunkWithSocket, logger]
  : [thunk];

const configureStore = (preloadedState = {}) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    || compose;

  return createStore(
    appReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware)),
  );
};

export default configureStore;
