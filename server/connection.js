const UserController = require('./controllers/user-controller');
const WallController = require('./controllers/wall-controller');
const Wall = require('./models/wall-model');
const WallPost = require('./models/wall-post-model');
const User = require('./models/user-model');
const { logger } = require('./loggers');
// const user = require('./user');
// const wall = require('./wall');

// event names
const GET_ID = 'Get_Id';
const SET_ID = 'Set_Id';
const INITIALIZATION = 'Initialization';
const SIGN_IN = 'Sign_In';
const SIGN_UP = 'Sign_Up';

const AUTH_ANON = 'Auth::Sign-In-Anon';
const AUTH_ANON_OK = 'Auth::Sign-In-Anon::OK'; // or _OK at the end
const AUTH_ANON_ERR = 'Auth::Sign-In-Anon::Error';

const AUTH_LOGIN = 'Auth::Login';
const AUTH_LOGIN_DONE = 'Auth::Login::Done';
const AUTH_LOGIN_ERR = 'Auth::Login::Error';

const AUTH_SIGN_UP = 'Auth::Sign-Up';
const AUTH_SIGN_UP_DONE = 'Auth::Sign-Up::Done';
const AUTH_SIGN_UP_ERR = 'Auth::Sign-Up::Error';

const AUTH_SIGN_OUT = 'Auth::Sign-Out';
const AUTH_SIGN_OUT_DONE = 'Auth::Sign-Out::Done';
const AUTH_SIGN_OUT_ERR = 'Auth::Sign-Out::Error';

const WALL_CONNECT = 'Wall::Connect';
const WALL_CONNECT_DONE = 'Wall::Connect::Done';
const WALL_CONNECT_ERR = 'Wall::Connect::Error';

const LEAVE_WALL = 'Leave_Wall';
const MESSAGE = 'Message';
const IS_TYPING = 'Is_Typing';
const PING = 'Ping';
const CHANGE_NAME = 'Change_Name';
const DELETE_CHAT = 'Delete::Chat::Fail';
const OPEN_CHAT = 'OPEN_CHAT';
const LEAVE_CHAT = 'LEAVE_CHAT';
const HAS_ID = 'Has_Id';

const validator = {
  validateIncoming() { return true; },
};

const toJSON = obj => JSON.stringify(obj);

class WebsocketConnection {
  constructor(socket, websocketServer) {
    this.ws = socket;
    this.wss = websocketServer;
    this.userIdQueue = [];
    this.wallQueue = [];
    // this.getWall();
    // this.getUserId();
    this.socketEventHandlers = {
      // [GET_ID]: () => {
      //   // const newClient = client.addOne(socket);
      //   // // send back to client his new id
      //   // this.sendNewClientId(newClient.id, socket);
      //   // // create chats between new client and each other
      //   // this.createChats(newClient.id);
      //   this.userId = user.assignId();
      //   this.socket.send(JSON.stringify({ key: SET_ID, userId: this.userId }));
      // },
      [INITIALIZATION]: (incoming) => {
        logger.debug('Initializtion message received ', incoming);
      },
      [AUTH_ANON]: async ({ userId }) => {
        // TODO: authenticate in db
        if (userId) {
          this.userId = userId;
          logger.debug('Auth anon with existing user id: ', userId);
          this.sendBack(AUTH_ANON_OK, { id: userId });
          return;
        }
        try {
          const newUserId = await this.getUserId();
          logger.debug('New user id that will be sent: ', newUserId);
          this.sendBack(AUTH_ANON_OK, { id: newUserId });
        } catch (e) {
          logger.error('Failed to create anon user ', e);
          this.sendBack(AUTH_ANON_ERR, { message: e.message });
        }
      },
      [AUTH_LOGIN]: async ({ userId, jwt }) => {},
      [AUTH_SIGN_UP]: (incoming) => {
        // TODO: check if user with same login is present
      },
      [WALL_CONNECT]: async ({ userId, city }) => {
        // NOTE: can get city-to-wallId lookup table at client boot with
        // separate request
        const [err, wall] = await WallController.addSubscribers(userId, city);

        if (err) {
          logger.error('Cant connect to wall ', err);
          this.sendBack(WALL_CONNECT_ERR, { message: err.message });
        } else {
          logger.debug('Connected to wall with id: ', wall.id);
          this.sendBack(WALL_CONNECT_DONE, { wall });
        }
      },
      // .catch(), /* do something */
      [LEAVE_WALL]: () => this.getWall().then((wall) => {
        wall.unsubscribe(this.userId);
      }),
      // [JOIN_WALL]: () => Promise.all([this.getWall(), this.getUserId()])
      //   .then(([wall, userId]) => wall.subscribe(userId)),
      // [LEAVE_WALL]: () => this.getWall()
      //   .then((wall) => {
      //     return this.getUserId()().then((userId) => {
      //       return ({ wall, userId });
      //     });
      //   })
      //   .then(({ wall, userId }) => {
      //     return wall.unsubscribe(userId);
      //   }),
      [MESSAGE]: incoming => this.resendMessageToAll(socket, incoming),
      [IS_TYPING]: incoming => this.sendTypingNotification(socket, incoming),
      [PING]: () => this.sendPong(socket),
      [CHANGE_NAME]: () => {},
      [DELETE_CHAT]: incoming => this.removeChat(incoming),
      [OPEN_CHAT]: incoming => this.createChat(socket, incoming),
      [LEAVE_CHAT]: () => {},
      [HAS_ID]: incoming => console.log('Has userId: ', incoming.userId),
    };
    // apply handlers to socket events
    Object.keys(this.socketEventHandlers).forEach((eventName) => {
      socket.on(eventName, (data) => {
        logger.debug(
          'Received data: ',
          JSON.parse(data),
          ` on ${eventName} event`,
        );
        this.socketEventHandlers[eventName](JSON.parse(data));
      }); // TODO: bind this
    });
  }

  async getWall() {
    if (this.wall) { // combine with next if
      return this.wall;
    }
    // let wall;
    // if (this.getWallPromise) {
    //   wall = await this.getWallPromise;
    // } else {
    //   const getWallPromise = Wall.findSingle();
    //   this.getWallPromise = getWallPromise;
    //   wall = await getWallPromise;
    // }
    // this.getWallPromise = null;

    const wall = await Wall.findSingle();

    this.wall = wall;
    return wall;
  }

  async getUserId() {
    if (this.userId) {
      return this.userId;
    }
    // store promise to prevent duplicated queries for new user creation
    // need to create only one user per single connection
    if (!this.createUserPromise) {
      this.createUserPromise = UserController.createAnon();
    }
    const [err, newUser] = await this.createUserPromise;

    this.createUserPromise = null;

    if (newUser) {
      this.userId = newUser.id;
      return this.userId;
    }
    return Promise.reject(err);
  }

  changeId(newId) {
    if (wall.isSubscriber(this.userId)) {
      wall.replaceSubscriber(this.userId, newId);
    }
    this.userId = newId;
  }

  handleIncoming(rawIncoming) {
    let incoming = null;

    try {
      incoming = JSON.parse(rawIncoming);
    } catch (e) {
      logger.error('Failed to parse incoming JSON ', e);
    }

    if (!incoming || !validator.validateIncoming(incoming)) {
      return;
    }
    // const { key, userId } = incoming; // if userId is stored on client
    const { key } = incoming;

    if (!this.socketEventHandlers.hasOwnProperty(key)) {
      logger.error('Unknown key of incoming message');
    } else if (!this.userId) { // !userId - if userId is stored on client
      this.getUserId()()
        // .then(id => this.socket.send({ key: INITIALIZATION, userId: id }))
        .then(() => this.socketEventHandlers[key](incoming));
      // catch() do something if failed, repeat or whatever needed
    } else {
      // this.userId = userId; // if userId is stored on client
      this.socketEventHandlers[key](incoming);
    }
  }

  handleClose() {
    if (this.userId) {
      User.deleteOneById(this.userId); // TEMP:
    }
    if (this.wall && this.userId) {
      this.wall.unsubscribe(this.userId);
    }
    // user.signOut(this.userId);
  }

  sendBack(eventName, outgoing) {
    this.socket.emit(eventName, toJSON(outgoing));
  }

  // call it from constructor
  // setMessageTypeHandlers() {
  //   const messageTypesMap = {
  //     // [GET_ID]: () => {
  //     //   // const newClient = client.addOne(socket);
  //     //   // // send back to client his new id
  //     //   // this.sendNewClientId(newClient.id, socket);
  //     //   // // create chats between new client and each other
  //     //   // this.createChats(newClient.id);
  //     //   this.userId = user.assignId();
  //     //   this.socket.send(JSON.stringify({ key: SET_ID, userId: this.userId }));
  //     // },
  //     [SIGN_IN]: (incoming) => {
  //       const authData = user.signIn(incoming.login);
  //
  //       if (authData) {
  //         // TODO: create user id on connection and just add login/token on
  //         // sign in/sign up OR this.changeId with resubscribing to wall
  //         // this.userId = authData.id;
  //         this.changeId(authData.id);
  //         this.socket.send(JSON.stringify({
  //           key: SIGN_IN, userId: authData.id, token: authData.token,
  //         }));
  //       } else {}
  //       // TODO: send fail message, perhaps without token with reason
  //     },
  //     [SIGN_UP]: (incoming) => {
  //       // TODO: check if user with same login is present
  //       const newUser = user.signUp(incoming.login);
  //       this.userId = newUser.id;
  //       this.socket.send(JSON.stringify({
  //         key: SIGN_UP, userId: this.userId, token: newUser.token,
  //       }));
  //     },
  //     [JOIN_WALL]: () => Promise.all([this.getWall(), this.getUserId()()])
  //       .then(([wall, userId]) => wall.subscribe(userId)),
  //     // .catch(), /* do something */
  //     [LEAVE_WALL]: () => this.getWall()
  //       .then((wall) => {
  //         return this.getUserId()().then((userId) => {
  //           return ({ wall, userId });
  //         });
  //       })
  //       .then(({ wall, userId }) => {
  //         return wall.unsubscribe(userId);
  //       }),
  //     [MESSAGE]: incoming => this.resendMessageToAll(socket, incoming),
  //     [IS_TYPING]: incoming => this.sendTypingNotification(socket, incoming),
  //     [PING]: () => this.sendPong(socket),
  //     [CHANGE_NAME]: () => {},
  //     [DELETE_CHAT]: incoming => this.removeChat(incoming),
  //     [OPEN_CHAT]: incoming => this.createChat(socket, incoming),
  //     [LEAVE_CHAT]: () => {},
  //     [HAS_ID]: () => console.log('Has userId: ', userId),
  //   };
  //
  //   // this function will become this.handleSpecificMessageType
  //   return (key, incoming) => {
  //     if (messageTypesMap.hasOwnProperty(key)) {
  //       messageTypesMap[key](incoming);
  //     } else {
  //       console.error('Unknown key of incoming message');
  //     }
  //   };
  // }
}

module.exports = WebsocketConnection;
