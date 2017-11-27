import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import configureStore from './store/configureStore';

import './styles/main.scss';

const initialState = {
  nickname: '',
  messages: [
    {
      clientId: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message'
    }
  ],
  whoIsTyping: [],
  websocketStatus: 'CLOSED'
};

const store = configureStore(initialState);

store.subscribe(() => console.log('New state from store: ', store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
