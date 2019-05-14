const socketIO = require('socket.io');
const Wall = require('./models/wall-model');
const User = require('./models/user-model');
const AnonUser = require('./models/anon-user-model');
const { log } = require('./loggers')(module);
const WebsocketConnection = require('./connection');

// const handleMessage = (socket, onMessage) => (income) => {
//   // console.log('Socket message received: %s', income);
//   if (typeof onMessage === 'function') {
//     onMessage(socket, income);
//   }
// };

const handleConnection = (socket, wss) => {
  const connection = new WebsocketConnection(socket, wss);

  // heartbeat
  socket.on('ping', () => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour12: false });
    log.info(`ping from client received - ${timeNow}`);
    // TODO: remove as this event is reserved and should not be used
    socket.emit('pong');
  });

  // IDEA: bind events to handlers with forEach/reduce, then pass to each
  // handler connController as 2nd argument to utilize senBack, broadcast and
  // others

  socket.on('message', (income) => {
    // TODO: some unknown additional GET request to 8080 happens
    // after websocket connection request
    // console.log('Socket message received: %s', income);
    // messenger.handleIncoming(income, socket); // OR this
    connection.handleIncoming(income);
  });

  socket.on('error', (error) => {
    log.error('Websocket onerror with error: ', error);
    socket.terminate();
    // messenger.removeChat(chat);
  });

  socket.on('disconnect', () => {
    connection.handleClose();
    log.debug('socket disconnect, connected clients amount: ');
  });
};

const startServer = (httpServer, pingInterval) => {
  const socketIOServer = socketIO(httpServer);
  // const connections = new Set();

  // const messenger = new Messenger(socketIOServer);
  // socketIOServer.on('connection', handleConnection(messenger));

  User.countDocuments({}).exec().then((count) => {
    log.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु count: ', String(count));
  }).catch(e => log.error('Users count error: ', e));

  User.deleteAll();

  AnonUser.dropIndexes();

  AnonUser.countDocuments({}).exec().then((count) => {
    log.debug('Current Anonymous USERS count: ', String(count));
  }).catch(e => log.error('Users count error: ', e));

  AnonUser.deleteAll();

  const makeSingleWall = () => Wall.createOne({
    city: 'Singapore',
    subscribers: [],
  });

  Wall.countDocuments({}, (error, count) => {
    if (error) return log.error(error);
    if (count === 0) {
      log.debug('Wall count is 0: ', String(count));
      return makeSingleWall();
    }
    if (count > 1) {
      log.debug('Wall count is: ', count);
      return Wall.deleteAll(makeSingleWall);
    }
    log.debug('Wall count is: ', count);
    return count;
  });

  socketIOServer.on('connection', (socket, req) => {
    // const connection = new WebsocketConnection(socket, socketIOServer);
    // connections.add(connection);
    // handleConnection(socket, connections, connection);
    handleConnection(socket, socketIOServer);
  });
  socketIOServer.on('error', (error) => {
    log.error('Websocket Server error ', error);

    // socketIOServer.close(() => {
    //   setTimeout(() => startServer(httpServer), 1000); // maybe remove timeout
    // });
  });

  return socketIOServer;
};

const stopServer = (socketIOServer) => {
  socketIOServer.close(() => log.info('Websocket Server was stopped'));
};

exports.start = startServer;
exports.stop = stopServer;
