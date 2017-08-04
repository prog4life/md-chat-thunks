const http = require('http');
const path = require('path');
// const url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const startWebsocket = require('./ws-server');
const messenger = require('./messenger');

// if not pass "app", can use alternative further: server.on('request', app);
const server = http.createServer(app);

const port = process.env.PORT || 8787;
const ip = process.env.IP || 'localhost';

startWebsocket(server);

const chat = messenger.createChat();

// app.use(bodyParser.json()); // or:
const jsonParser = bodyParser.json();

// app.set('view-engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// alternative manner:
// const favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

// TODO: change to "/messages" or "/chat"
// TODO: separate "isTyping" route
app.post('/comet', jsonParser, (req, res) => {
  // TODO: Sanity check the incoming data, maybe within chat methods          !!!
  //     Where to check data, in controller or in model ?
  var receivedData = {
    id: req.body.id,
    type: req.body.type,
    message: req.body.message
  };

  // for GET request with query string parameters:
  // if (req.params.message) {
  //    receivedData = {
  //        author: 'Bucky',
  //        message: req.params.message,
  //        chat: chat
  //    };

  // Manual POST request body parsing:
  // var receivedData = {}
  // var body = [];
  // var message = '';
  // req.on('data', function(chunk) {
  //    body[body.length] = chunk;
  // }).on('end', function() {
  //    body = Buffer.concat(body).toString();
  //    try {
  //        body = JSON.parse(body);
  //    } catch (e) {
  //        console.log('parsing body JSON error: ' + e);
  //    }
  //    receivedData.message = body.message;
  //    chat.send(receivedData);
  //    res.status(200).end('OK');
  // });

  console.log('"/comet" has been requested, received data: ' +
    JSON.stringify(receivedData));

  chat.publish(receivedData);
  res.status(200).end('OK');
});

// TODO: separate route to get id
app.get('/subscribe', (req, res) => {
  console.log('subscribe req handler was called with id: ' + req.query.id);
  console.log('in-subscribe handler req.query.id type: ' +
    typeof req.query.id);

  var id = req.query.id;

  // TODO: id is stored as string with this variant
  // TODO: check that id can be parsed to integer number with less than 9 digits

  if (!id) {
    id = chat.assignId(res);
  } else {
    chat.subscribe(req, res, id);
  }
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.code = 404;

  next(error);
});

// Short form, without an explicit creation of http.Server object:
// app.listen(0, function() {
//    console.log('Express Node.js server is listening at ' +
//        server.address().port + ' port');
// });

// app.set('port', 8888);
// app.get('port');

app.use((error, req, res, next) => {
  // 4 args required to set error handling middleware
  console.error(error.message);
  // next(error);
  // wss.close([callback]);
  res.status(error.code || 500); // chain sendFile here OR:
  res.sendFile(path.join(__dirname, './views/error.html')); // OR:
  // only if template engine is enabled
  // res.render('error', { error });
});

app.set('port', port);
app.set('ip', port);
// TODO: rename ip to hostname
server.listen(port, ip);
// same as passing callback as 3rd arg to server.listen() above:
server.on('listening', () => {
  // TODO: replace by app.get('port');
  console.log('Up & running at ' + server.address().port + ' port');
});

server.on('error', (error) => console.error('Unable to start server ', error));
