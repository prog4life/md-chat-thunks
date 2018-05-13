import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import configureStore from 'store/configureStore';
import { loadState, saveState } from 'utils/localStorage';

import 'bootstrap/dist/css/bootstrap.min.css';

// import 'normalize.css/normalize.css';
import 'styles/index.scss';

// import 'assets/favicon.png';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const initialState = {
  // client: {
  //   clientId: '',
  //   nickname: '',
  // },
  chats: [
    // {
    //   id: 'tfhn523'
    // },
    // {
    //   id: 'bpxv98'
    // }
  ],
  messages: [
    {
      id: 'first',
      clientId: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message',
      isOwn: false,
      status: 'SENT', // must be not viewed as not own
    },
    {
      id: 'scnd',
      clientId: 'wdadr27408908',
      nickname: 'Like Me',
      text: 'Whatever You want',
      isOwn: true,
      status: 'UNSENT',
    },
  ],
  whoIsTyping: '',
};

const persistedState = loadState('md-chat-state') || {};

const store = configureStore(initialState);

// store.subscribe(() => console.log('New state from store: ', store.getState()));

ReactDOM.render(<App store={store} />, document.getElementById('app'));
