const socketIO = require('socket.io');
const Wall = require('./models/Wall');
const User = require('./models/User');
const { logger } = require('./loggers');
const WebsocketConnection = require('./connection');

// const handleMessage = (socket, onMessage) => (incoming) => {
//   // console.log('Socket message received: %s', incoming);
//   if (typeof onMessage === 'function') {
//     onMessage(socket, incoming);
//   }
// };

const handleConnection = (socket, wss) => {
  const connection = new WebsocketConnection(socket, wss);

  // heartbeat
  socket.on('ping', () => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour12: false });
    logger.info(`ping from client received - ${timeNow}`);
    socket.emit('pong');
  });

  socket.on('message', (incoming) => {
    // TODO: some unknown additional GET request to 8080 happens
    // after websocket connection request
    // console.log('Socket message received: %s', incoming);
    // messenger.handleIncoming(incoming, socket); // OR this
    connection.handleIncoming(incoming);
  });

  socket.on('error', (error) => {
    logger.error('Websocket onerror with error: ', error);
    socket.terminate();
    // messenger.removeChat(chat);
  });

  socket.on('disconnect', (code, reason) => {
    // messenger.removeChats(socket);
    // messenger.removeClient(socket);
    connection.handleClose();
    logger.debug('Websocket onclose code: %s and reason: %s ', code, reason);
    // console.log('socket onclose clients size', messenger.wss.clients.size);
    logger.debug('Websocket onclose clients size', connection.wss.clients.size);
  });
};

const startServer = (httpServer, pingInterval) => {
  const socketIOServer = socketIO(httpServer);
  // const connections = new Set();

  // const messenger = new Messenger(socketIOServer);
  // socketIOServer.on('connection', handleConnection(messenger));

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

  socketIOServer.on('connection', (socket, req) => {
    // const connection = new WebsocketConnection(socket, socketIOServer);
    // connections.add(connection);
    // handleConnection(socket, connections, connection);
    handleConnection(socket, socketIOServer);
  });
  socketIOServer.on('error', (error) => {
    logger.error('Websocket Server error ', error);

    // socketIOServer.close(() => {
    //   setTimeout(() => startServer(httpServer), 1000); // maybe remove timeout
    // });
  });

  return socketIOServer;
};

const stopServer = (socketIOServer) => {
  socketIOServer.close(() => logger.info('Websocket Server was stopped'));
};

exports.start = startServer;
exports.stop = stopServer;
