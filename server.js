const http = require('http');
const path = require('path');
const express = require('express');

// const webpack = require('webpack');
// const webpackDevMiddleWare = require('webpack-dev-middleware');
// const config = require('./webpack.config.js');
// const compiler = webpack(config);

const websocketServer = require('./server/websocket-server');

const app = express();

const server = http.createServer(app);

websocketServer.start(server);
// websocketServer.setWebsocketMsgHandler(chat.handleIncomingData.bind(chat));

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
  console.log(`Server is listening at ${server.address().port} port`);
});
