const http = require('http');
const path = require('path');
const url = require('url');
const parser = require('body-parser');
const websocket = require('ws');
const messenger = require('./messenger');
const express = require('express');
const app = express();

const server = http.createServer(app);  // optional
// If not pass app at prior line, then do:
// server.on('request', app);

var chat = messenger.createChat();

// app.use(parser.json()); // or:
const jsonParser = parser.json();

const wss = new websocket.Server({
  // TODO: try to use on diferent port while express server up and running
  port: 8008,
  // clientTracking: true,
  verifyClient: (info, done) => {
    // info.req is client request object
    // console.log('info obj from verifyClient: ', info);
    // "express-session" was used in example
    // sessionParser(info.req, {}, () => { // parsing session from client
    // We can reject the connection by returning false to done(). For example,
    // reject here if user is unknown.
    done(true); // done(info.req.session.userId);
  },
  // server, // set this or port, look above
  perMessageDeflate: false // compression extension disabled (default)
});

// console.log('chat.length: %s', Object.keys(chat).length);

wss.on('connection', function connection(ws, req) {
  // Can use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  // It seems it's available only in a newer version
  // const location = url.parse(req.url, true);

  // answer: wss.clients is a {Set} that stores all conected clients(added only 
  // if clientTracking is truу (default?))

  // TODO: check broadcasting

  ws.on('message', function incoming(message) {
    console.log('Socket message received: %s', message);

    // TODO: Sanity check the incoming data maybe within chat methods   !!!
    // Where to check data, in controller or in model
  //   var parsed = null;

  //   console.log('parsed: ' + parsed);

  //   try {
  //     parsed = JSON.parse(message);
  //   } catch (e) {
  //     console.log('in ws.on-message parsing JSON "message" error: ' + e);
  //   }

  //   // TODO add socket to store right after assigning id, without additional request - looks like done
  //   if (!parsed.clientId) {
  //     parsed.clientId = chat.assignSocketId(ws);
  //   }
  //   if (chat.addSocket(ws, parsed)) {
  //     chat.sendSocket(message);
  //   }
    let parsed = null;

    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.error(e);
    }
    console.log('parsed: ', parsed);

    if (parsed.id) {
      wss.clients.forEach((client) => {
        if (ws === client) {
          console.log('index of matched item ', wss.clients.indexOf(ws));
          return;
        }
        client.send(message);
      });
    } else {
      ws.send(JSON.stringify({id: Math.random().toString().slice(2)}));
    }
  });

  ws.on('error', function sockerr(error) {
    // TODO: remove instances from sockets ?
    let brokenWS = wss.clients.indexOf(ws);

    wss.clients.splice(brokenWS, 1);
    console.error('in-wss cb socket error: ' + error);
  });

  ws.on('close', function closeWebocket() { 
    // TODO: remove instances from clients array, might be removed already
    console.log('close on ws');
  });
});

app.get('/favicon.ico', (req, res) => {
  console.log('favicon req handler');
  res.set('Content-Type', 'image/x-icon').sendStatus(200).end();
});
// alternative manner - app.favicon(...);

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
  // console.log('req.query length is: ' + Object.keys(req.query).length);

  if (Object.keys(req.query).length !== 0) {
    console.log('req.query length is not 0');
    res.redirect('/');
  } else {
    console.log('static file requested');
    next();
  }
// move to the top
}, express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res) {
  //res.redirect(302, '/redirect.html');
  res.redirect(302, '/');
  //res.render(view [, locals] [, callback]);                         Try this !!!
});

//app.get('/*', function(req, res) {
//
//    res.send('Default request handler invoked');
//});

// Short form, without an explicit creation of http.Server object:

//app.listen(0, function() {
//    console.log('Express Node.js server is listening at ' +
//        server.address().port + ' port');
//});

//app.set('port', 8888);
//app.get('port');

app.use(function (err, req, res, next) {
  // 4 args required to set error handling middleware, also next() or end res
  console.error(err.stack);
  next(err);
});

app.use(function (err, req, res, next) {
  // wss.close([callback]);
  res.status(500).end('Error occurred: ' + err);
});

// server.listen(8888, function() {
server.listen(process.env.PORT || 8888, process.env.IP || 'localhost', () => {
  console.log('Express Node.js server is listening at ' +
    server.address().port + ' port');
});
