import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux';
import configureStore from '../store/configureStore';
import App from 'App';

const initialState = {
  nickname: '',
  messages: [
    {
      id: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message'
    }
  ],
  whoIsTyping: []
};

const store = configureStore(initialState);

store.subscribe(() => console.log('New state from store: ', store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
