import { createStore, compose, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import reducer from '../reducers';

const configureStore = (initialState = {}) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;

  // const sagaMiddleware = createSagaMiddleware();

  return createStore(
    reducer,
    initialState,
    // composeEnhancers(applyMiddleware(sagaMiddleware))
    composeEnhancers(applyMiddleware(thunk))
  );
};

export default configureStore;
