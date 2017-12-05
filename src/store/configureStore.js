import { createStore, compose, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
// import logger from 'redux-logger'; // to get logger mw with default options
import immutabilityWatcher from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
import mainReducer from '../reducers';

// must be the last middleware in chain
const logger = createLogger({
  duration: true
});

const middleware = process.env.NODE_ENV === 'development'
  ? [immutabilityWatcher(), thunk, logger]
  : [thunk, logger];

const configureStore = (initialState = {}) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;

  // const sagaMiddleware = createSagaMiddleware();

  return createStore(
    mainReducer,
    initialState,
    // composeEnhancers(applyMiddleware(sagaMiddleware, logger))
    composeEnhancers(applyMiddleware(...middleware))
  );
};

export default configureStore;
