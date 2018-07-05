const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { logger, requestLogger, errorLogger } = require('./server/loggers');
require('./server/db/mongoose');

// TODO: rename this file to app.js / index.js / etc

// const webpack = require('webpack');
// const webpackDevMiddleWare = require('webpack-dev-middleware');
// const config = require('./webpack.config.js');
// const compiler = webpack(config);
const websocketServer = require('./server/websocket-server');

const app = express();
const server = http.createServer(app);

websocketServer.start(server);

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
const morganMessageFormat = ':remote-addr :date - HTTP/1.1 :method ":url" ' +
  ':status - :response-time[0] ms - :res[content-length] Kb :referrer';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(morganMessageFormat));
app.use(requestLogger);
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

app.use(errorLogger);

// optionally can include custom error handler
// app.use(express.errorLogger({
//   dumpExceptions: true,
//   showStack: true,
// }));

app.use((error, req, res, next) => {
  logger.error(error.message);
  res.status(error.code || 500).end(error);
});

server.listen(port);

server.on('listening', () => {
  logger.info(`Server is listening at ${server.address().port} port`);
});
