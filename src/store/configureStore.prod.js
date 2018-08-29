import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import appReducer from 'state/reducer';

// must be the last middleware in chain
// const logger = createLogger({
//   duration: true,
//   predicate: (getState, action) => {
//     const hiddenTypes = [];
//     return !hiddenTypes.some(type => type === action.type);
//   }
// });

// const middleware = [thunk, logger];
const middleware = [thunk];

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
