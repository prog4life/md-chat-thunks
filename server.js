const http = require('http');
const path = require('path');
const express = require('express');

// const webpack = require('webpack');
// const webpackDevMiddleWare = require('webpack-dev-middleware');
// const config = require('./webpack.config.js');

const app = express();

// const compiler = webpack(config);

const startWebsocketServer = require('./websocket-server');

const server = http.createServer(app);

startWebsocketServer(server);

const port = process.env.PORT || 8787;
const hostname = process.env.IP || 'localhost';

// app.use(webpackDevMiddleWare(compiler, {
//   publicPath: config.output.publicPath,
//   stats: {
//     colors: true
//   }
// }));

app.set('port', port);
app.set('hostname', hostname);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

app.use((req, res, next) => {
  const error = new Error('Not Found');

  error.code = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(error.code || 500).end(error);
});

server.listen(port, hostname);

server.on('listening', () => {
  console.log(`Up & running at ${server.address().port} port`);
});

server.on('error', error => console.error('Server error: ', error));
