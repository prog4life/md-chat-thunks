import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import configureStore from './store/configureStore';

import './styles/main.scss';

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
  typing: [],
  websocketStatus: 'CLOSED'
};

const store = configureStore(initialState);

// store.subscribe(() => console.log('New state from store: ', store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
