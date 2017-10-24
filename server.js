const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const startWebsocketServer = require('./websocket-server');

const server = http.createServer(app);

startWebsocketServer(server);

const port = process.env.PORT || 8787;
const hostname = process.env.IP || 'localhost';

app.set('port', port);
app.set('hostname', hostname);

app.use(express.static(path.join(__dirname, 'public')));
// TODO: temporary styles are loaded from this dir
app.use(express.static(path.join(__dirname, 'src')));

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
