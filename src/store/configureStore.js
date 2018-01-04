import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger'; // to get logger mw with default options
import immutabilityWatcher from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
import topReducer from 'reducers';

// must be the last middleware in chain
const logger = createLogger({
  duration: true
});

const middleware = process.env.NODE_ENV === 'development'
  ? [immutabilityWatcher(), thunk, logger]
  : [thunk];

const configureStore = (initialState = {}) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;

  return createStore(
    topReducer,
    initialState,
    // composeEnhancers(applyMiddleware(thunk, logger))
    composeEnhancers(applyMiddleware(...middleware))
  );
};

export default configureStore;
