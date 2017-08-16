const http = require('http');
const path = require('path');
// const url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const startWebsocketServer = require('./websocket-server');

// if not pass "app", can use alternative further: server.on('request', app);
const server = http.createServer(app);

const port = process.env.PORT || 8787;
const hostname = process.env.IP || 'localhost';

app.set('port', port);
app.set('hostname', port);

startWebsocketServer(server);

// app.use(bodyParser.json()); // OR:
// const jsonParser = bodyParser.json();

// TODO: look react-router docs for Express config to work with "browserHistory"

// app.set('view-engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
// TODO: temporary styles are loading from this dir
app.use(express.static(path.join(__dirname, 'src')));

// alternative manner:
// const favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
  // wss.close([callback]);
  res.status(error.code || 500); // chain sendFile here OR:
  res.sendFile(path.join(__dirname, './views/error.html')); // OR:
  // with enabled template engine
  // res.render('error', { error });
});

server.listen(port, hostname);

server.on('listening', () => {
  console.log(`Up & running at ${server.address().port} port`);
});

server.on('error', (error) => console.error('Unable to start server ', error));
