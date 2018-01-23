// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';

import 'normalize.css/normalize.css';
import 'styles/index.scss';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

ReactDOM.render(<App />, document.getElementById('app'));
