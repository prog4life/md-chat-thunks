const ws = require('ws');
const { Wall } = require('./models/Wall');
const { logger } = require('./loggers');
const { Messenger } = require('./messenger');
const WebsocketConnection = require('./websocket-connection');

const DEF_PING_INTRVL = 10000;
/* eslint-disable no-param-reassign */
const enablePing = (wss, interval = DEF_PING_INTRVL) => {
  wss.checkInterval = setInterval(() => {
    wss.clients.forEach((websocket) => {
      if (!websocket.isAlive) {
        websocket.terminate();
        return;
      }

      websocket.isAlive = false;
      websocket.ping('', false, true); // TODO: websocket.ping(noop);
    });
  }, interval); // NOTE: was 30000 in example
};

const disablePing = wss => clearInterval(wss.checkInterval);

// const handleMessage = (websocket, onMessage) => (incoming) => {
//   // console.log('Socket message received: %s', incoming);
//   if (typeof onMessage === 'function') {
//     onMessage(websocket, incoming);
//   }
// };

const handleConnection = (websocket, wss) => {
  const connection = new WebsocketConnection(websocket, wss);

  websocket.isAlive = true;
  // heartbeat callback
  websocket.on('pong', () => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour12: false });
    console.log(`pong from client - ${timeNow}`);
    websocket.isAlive = true;
  });

  websocket.on('message', (incoming) => {
    // TODO: some unknown additional GET request to 8080 happens
    // after websocket connection request
    // console.log('Socket message received: %s', incoming);
    // messenger.handleIncoming(incoming, websocket); // OR this
    connection.handleIncoming(incoming); // OR this
  });

  websocket.on('error', (error) => {
    console.error('websocket onerror with error: ', error);
    websocket.terminate();
    // messenger.removeChat(chat);
  });

  websocket.on('close', (code, reason) => {
    // messenger.removeChats(websocket);
    // messenger.removeClient(websocket);
    connection.handleClose();
    console.log('websocket onclose code: %s and reason: %s ', code, reason);
    // console.log('websocket onclose clients size', messenger.wss.clients.size);
    console.log('websocket onclose clients size', connection.wss.clients.size);
  });
};

const startServer = (httpServer, pingInterval) => {
  const wss = new ws.Server({
    server: httpServer, // OR:
    // to use on different port than express server
    // port: 8484
  });
  // const connections = new Set();

  // const messenger = new Messenger(wss);
  // wss.on('connection', handleConnection(messenger));
  let wallId;

  const makeSingleWall = () => {
    Wall.createOne({ subscribers: [] })
      .then((newWall) => { wallId = newWall.id; });
  };

  Wall.count({}, (error, count) => {
    if (error) return logger.error(error);

    if (count === 0) {
      logger.debug('Wall count is 0: ', count);
      return makeSingleWall();
    }

    if (count > 1) {
      logger.debug('Wall count is > 1 ', count);

      return Wall.deleteAll(makeSingleWall);
    }
    logger.debug('Wall count is < 0 || 1 : ', count);
    return count;
  });

  wss.on('connection', (websocket) => {
    // const connection = new WebsocketConnection(websocket, wss);
    // connections.add(connection);
    // handleConnection(websocket, connections, connection);
    handleConnection(websocket, wss);
  });
  wss.on('error', (error) => {
    console.error('Websocket Server error ', error);
    wss.close(() => {
      setTimeout(() => startServer(httpServer), 1000);
    });
  });

  if (pingInterval !== false) {
    enablePing(wss, Number.isInteger(pingInterval) ? pingInterval : undefined);
  }
  return wss;
};

exports.start = startServer;
exports.enablePing = enablePing;
exports.disablePing = disablePing;
