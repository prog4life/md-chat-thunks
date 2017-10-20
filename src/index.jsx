import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux';
import configureStore from '../store/configureStore';
import App from 'App';

const store = configureStore();

store.subscribe(() => console.log('New state from store: ', store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
