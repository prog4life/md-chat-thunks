const websocket = require('ws');
const chat = require('./websocket-chat').createChat();

const startServer = (server) => {
  const wss = new websocket.Server({
    server // OR:
    // to use on diferent port than express server
    // port: 8484
  });

  chat.setWebsocketServer(wss);

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    // heartbeat callback
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    // TODO: try currying here
    ws.on('message', (incoming) => {
      console.log('Socket message received: %s', incoming);

      chat.handleIncomingData(ws, incoming);
    });

    ws.on('error', (error) => {
      console.error('ws onerror with error: ', error);
      ws.terminate();
    });

    ws.on('close', (code, reason) => {
      console.log('ws onclose code: %s and reason: %s ', code, reason);
      console.log('ws onclose clients size', wss.clients.size);
    });
  });

  wss.on('error', (error) => {
    console.error('Websocket Server error ', error);
    wss.close(() => {
      setTimeout(() => startServer(server), 1000);
    });
  });

  wss.checkInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }

      ws.isAlive = false;
      ws.ping('', false, true);
    });
  }, 10000); // NOTE: was 30000 in example

  return wss;
};

module.exports = startServer;
