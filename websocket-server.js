const websocket = require('ws');
const url = require('url');
const chat = require('./websocket-chat').createChat();

/* eslint prefer-arrow-callback: 0 */

const startServer = (server) => {
  const wss = new websocket.Server({
    // TODO: try to use on diferent port while express server up and running
    // port: 8484, // OR:
    server
  });

  chat.setWebsocketServer(wss);

  wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    console.log('wss onconnection location', location.pathname);

    // TODO: try currying here
    ws.on('message', function incoming(incomingData) {
      console.log('Socket message received: %s', incomingData);

      chat.handleIncomingData(ws, incomingData);
    });

    ws.on('error', function sockerr(error) {
      // TODO: remove instances from sockets, close ws ?
      // wss.clients.delete(ws);

      console.error('ws onerror with error: ', error);
      console.log('ws onerror clients ', Array.from(wss.clients));
    });

    ws.on('close', function closeWebSocket(code, reason) {
      console.log('ws onclose code: %s and reason: %s ', code, reason);
      console.log('ws onclose clients size', wss.clients.size);
    });
  });
};

// TODO: export other functions separately when testing will be added
module.exports = startServer;
