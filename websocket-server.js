const ws = require('ws');

const DEF_PING_INTRVL = 10000;

let actualMessageHandler;

const enablePing = (wss, interval = DEF_PING_INTRVL) => {
  wss.checkInterval = setInterval(() => {
    wss.clients.forEach((websocket) => {
      if (!websocket.isAlive) {
        websocket.terminate();
        return;
      }

      websocket.isAlive = false;
      websocket.ping('', false, true);
    });
  }, interval); // NOTE: was 30000 in example
};

const disablePing = wss => clearInterval(wss.checkInterval);

const setOnMessageHandler = (onMessage) => {
  if (typeof onMessage === 'function') {
    actualMessageHandler = onMessage;
  } else {
    console.error('Expected function as websocket message event handler');
  }
};

const handleMessage = (websocket, onMessage) => (incoming) => {
  // console.log('Socket message received: %s', incoming);
  if (typeof onMessage === 'function') {
    onMessage(websocket, incoming);
  }
};

const handleConnection = (wss, websocketEventHandlers = {}) => (websocket) => {
  const {
    handleMessage,
    handleError,
    handleClose
  } = websocketEventHandlers;

  websocketServer.setWebsocketMsgHandler(chat.handleIncomingData.bind(chat));

  websocket.isAlive = true;
  // heartbeat callback
  websocket.on('pong', () => {
    console.log('pong from client');
    websocket.isAlive = true;
  });

  websocket.on('message', chat.handleIncomingData);

  websocket.on('error', (error) => {
    console.error('websocket onerror with error: ', error);
    websocket.terminate();
    messenger.removeChat(chat);
  });

  websocket.on('close', (code, reason) => {
    messenger.removeChat(chat);
    console.log('websocket onclose code: %s and reason: %s ', code, reason);
    console.log('websocket onclose clients size', wss.clients.size);
  });
};

const startServer = (httpServer, websocketHandlers = {}, pingInterval) => {
  const wss = new ws.Server({
    server: httpServer // OR:
    // to use on different port than express server
    // port: 8484
  });

  wss.on('connection', handleConnection(wss, websocketHandlers));
  wss.on('error', (error) => {
    console.error('Websocket Server error ', error);
    wss.close(() => {
      setTimeout(() => startServer(httpServer), 1000);
    });
  });

  if (pingInterval !== false) {
    enablePing(wss, pingInterval);
  }
  return wss;
};

exports.start = startServer;
exports.setWebsocketMsgHandler = setOnMessageHandler;
exports.enablePing = enablePing;
exports.disablePing = disablePing;
