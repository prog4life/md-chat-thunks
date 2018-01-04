const http = require('http');
const path = require('path');
const express = require('express');

// const webpack = require('webpack');
// const webpackDevMiddleWare = require('webpack-dev-middleware');
// const config = require('./webpack.config.js');
// const compiler = webpack(config);

const websocketChat = require('./websocket-chat');
const websocketServer = require('./websocket-server');

const app = express();

const server = http.createServer(app);

const wss = websocketServer.start(server);
const chat = websocketChat.create(wss);
websocketServer.setWebsocketMsgHandler(chat.handleIncomingData.bind(chat));

const port = process.env.PORT || 8787;
// can be something like: path.join(__dirname, '..', 'public')
const publicPath = path.join(__dirname, 'public');

app.set('port', port);

// app.use(webpackDevMiddleWare(compiler, {
//   publicPath: config.output.publicPath,
//   stats: {
//     colors: true
//   }
// }));

app.use(express.static(publicPath));

app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(publicPath, 'index.html'));
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

server.listen(port);

server.on('listening', () => {
  console.log(`Up & running at ${server.address().port} port`);
});
