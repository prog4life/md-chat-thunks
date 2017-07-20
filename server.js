var http = require('http');
var path = require('path');
var parser = require('body-parser');
var websocket = require('ws');
var messenger = require('./messenger');
var express = require('express');
var app = express();

var server = http.createServer(app);  // optional
// If not pass app at prior line, then do:
// server.on('request', app);

var chat = messenger.createChat();

// app.use(parser.json());  // or:
var jsonParser = parser.json();

var wss = new websocket.Server({
  server: server,
  perMessageDeflate: false  // compression extension disabled
});
console.log('chat.length: %s', Object.keys(chat).length);

wss.on('connection', function connection(ws) {

  // TODO: check wss.clients and broadcasting
  // answer: wss.clients is a {Set} that stores all conected clients(added only 
  // if clientTracking is truthy)
  // console.log('Socket connection established, wss.clients: %o', wss.clients);
  console.log('Socket wss.clientTracking: ' + wss.clientTracking);

  ws.on('message', function incoming(message) {

    console.log('Socket message received: %s', message);

    // TODO: Sanity check the incoming data maybe within chat methods   !!!
    // Where to check data, in controller or in model

    var parsed = null;
    console.log('parsed: ' + parsed);

    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.log('in ws.on-message parsing JSON "message" error: ' + e);
    }

    // TODO add socket to store right after assigning id, without additional request - looks like done
    if (!parsed.clientId) {
      parsed.clientId = chat.assignSocketId(ws);
    }
    if (chat.addSocket(ws, parsed)) {
      chat.sendSocket(message);
    }
  });

  ws.on('error', function sockerr(error) {  // TODO: remove instances from sockets ?
    console.error('in-wss cb socket error: ' + error);
  });

  ws.on('close', function () {         // TODO: remove instances from sockets
    console.log('close on ws');
  });
});

app.get('/favicon.ico', function (req, res) {
  'use strict';
  console.log('favicon req handler');
  res.set('Content-Type', 'image/x-icon').sendStatus(200).end();
});
// alternative manner - app.favicon(...);

// TODO: change to "/messages" or "/chat"
// TODO: separate "isTyping" route
app.post('/comet', jsonParser, function (req, res) {
  'use strict';

  // TODO: Sanity check the incoming data, maybe within chat methods          !!!
  //     Where to check data, in controller or in model ?
  var receivedData = {
    id: req.body.id,
    type: req.body.type,
    message: req.body.message
  };

  // for GET request with query string parameters:
  //if (req.params.message) {
  //    receivedData = {
  //        author: 'Bucky',
  //        message: req.params.message,
  //        chat: chat
  //    };

  // Manual POST request body parsing:
  //var receivedData = {}
  //var body = [];
  //var message = '';
  //req.on('data', function(chunk) {
  //    body[body.length] = chunk;
  //}).on('end', function() {
  //    body = Buffer.concat(body).toString();
  //    try {
  //        body = JSON.parse(body);
  //    } catch (e) {
  //        console.log('parsing body JSON error: ' + e);
  //    }
  //    receivedData.message = body.message;
  //    chat.send(receivedData);
  //    res.status(200).end('OK');
  //});

  console.log('"/comet" has been requested, received data: ' +
    JSON.stringify(receivedData));

  chat.publish(receivedData);
  res.status(200).end('OK');
});

// TODO: separate route to get id
app.get('/subscribe', function (req, res) {
  'use strict';
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

app.use(function (req, res, next) {
  'use strict';
  // console.log('req.query length is: ' + Object.keys(req.query).length);

  if (Object.keys(req.query).length !== 0) {
    console.log('req.query length is not 0');
    res.redirect('/');
  } else {
    console.log('static file requested');
    next();
  }
}, express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res) {
  'use strict';
  //res.redirect(302, '/redirect.html');
  res.redirect(302, '/');
  //res.render(view [, locals] [, callback]);                         Try this !!!
});

//app.get('/*', function(req, res) {
//    'use strict';
//
//    res.send('Default request handler invoked');
//});

// Short form, without an explicit creation of http.Server object:

//app.listen(0, function() {
//    'use strict';
//    console.log('Express Node.js server is listening at ' +
//        server.address().port + ' port');
//});

//app.set('port', 8888);
//app.get('port');

app.use(function (err, req, res, next) {
  'use strict';
  // 4 args required to set error handling middleware, also next() or end res
  console.error(err.stack);
  next(err);
});

app.use(function (err, req, res, next) {
  'use strict';
  // wss.close([callback]);
  res.status(500).end('Error occurred: ' + err);
});

// server.listen(8888, function() {
server.listen(process.env.PORT || 8888,
  process.env.IP || 'localhost', function () {
    'use strict';
    console.log('Express Node.js server is listening at ' +
      server.address().port + ' port');
  });
