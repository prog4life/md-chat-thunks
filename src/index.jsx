import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import configureStore from 'store/configureStore';

import 'normalize.css/normalize.css';
import 'styles/main.scss';

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

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

// store.subscribe(() => console.log('New state from store: ', store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
