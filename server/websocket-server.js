const ws = require('ws');
const Wall = require('./models/Wall');
const User = require('./models/User');
const { logger } = require('./loggers');
const { Messenger } = require('./messenger');
const WebsocketConnection = require('./websocket-connection');

const pingIntervals = [];

const DEF_PING_INTRVL = 10000;
const PING_MIN_INTRVL = 5000;
/* eslint-disable no-param-reassign */
const enablePing = (wss, interval = DEF_PING_INTRVL) => {
  if (!Number.isInteger(interval) || interval < PING_MIN_INTRVL) {
    throw new Error(`Expected ping interval to be integer and more than
      ${PING_MIN_INTRVL - 1}`);
  }
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

  pingIntervals.push(wss.checkInterval);
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
    logger.info(`pong from client - ${timeNow}`);
    websocket.isAlive = true;
  });

  websocket.on('message', (incoming) => {
    // TODO: some unknown additional GET request to 8080 happens
    // after websocket connection request
    // console.log('Socket message received: %s', incoming);
    // messenger.handleIncoming(incoming, websocket); // OR this
    connection.handleIncoming(incoming);
  });

  websocket.on('error', (error) => {
    logger.error('Websocket onerror with error: ', error);
    websocket.terminate();
    // messenger.removeChat(chat);
  });

  websocket.on('close', (code, reason) => {
    // messenger.removeChats(websocket);
    // messenger.removeClient(websocket);
    connection.handleClose();
    logger.debug('Websocket onclose code: %s and reason: %s ', code, reason);
    // console.log('websocket onclose clients size', messenger.wss.clients.size);
    logger.debug('Websocket onclose clients size', connection.wss.clients.size);
  });
};

const startServer = (httpServer, pingInterval) => {
  const wss = new ws.Server({
    server: httpServer, // OR:
    // to use on different port than express server
    // port: 8484
  });
  // const connections = new Set();
  pingIntervals.forEach(clearInterval); // doublecheck
  // const messenger = new Messenger(wss);
  // wss.on('connection', handleConnection(messenger));

  User.count({}).exec().then((count) => {
    logger.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु count: ', String(count));
  }).catch(e => logger.error('Users count error: ', e));

  User.deleteAll();

  const makeSingleWall = () => Wall.createOne({ subscribers: [] });

  Wall.count({}, (error, count) => {
    if (error) return logger.error(error);

    if (count === 0) {
      logger.debug('Wall count is 0: ', String(count));
      return makeSingleWall();
    }

    if (count > 1) {
      logger.debug('Wall count is > 1 ', count);

      return Wall.deleteAll(makeSingleWall);
    }
    logger.debug('Wall count is: ', count);
    return count;
  });

  wss.on('connection', (websocket, req) => {
    // const connection = new WebsocketConnection(websocket, wss);
    // connections.add(connection);
    // handleConnection(websocket, connections, connection);
    handleConnection(websocket, wss);
  });
  wss.on('error', (error) => {
    disablePing(wss);
    // pingIntervals.forEach(clearInterval); // doublecheck
    logger.error('Websocket Server error ', error);

    wss.close(() => {
      setTimeout(() => startServer(httpServer), 1000); // maybe remove timeout
    });
  });

  if (pingInterval !== null) {
    enablePing(wss, pingInterval);
  }
  return wss;
};

const stopServer = (wss) => {
  pingIntervals.forEach(clearInterval);
  wss.close(() => logger.info('Websocket Server was stopped'));
};

exports.start = startServer;
exports.stop = stopServer;
exports.enablePing = enablePing;
exports.disablePing = disablePing;
