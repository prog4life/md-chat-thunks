const UserController = require('./controllers/user-controller');
const WallController = require('./controllers/wall-controller');
const Wall = require('./models/wall-model');
const WallPost = require('./models/wall-post-model');
const User = require('./models/user-model');
const { log } = require('./loggers')(module);
// const user = require('./user');
// const wall = require('./wall');

// event names
const GET_ID = 'Get_Id';
const SET_ID = 'Set_Id';
const INITIALIZATION = 'Initialization';
const SIGN_IN = 'Sign_In';
const SIGN_UP = 'Sign_Up';

const AUTH_ANON = 'Auth::Sign-In-Anon';
const AuthAnonOk = 'AuthAnonOk'; // or _OK at the end
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
const JoinWallOk = 'JoinWallOk';
const WALL_CONNECT_ERR = 'Wall::Connect::Error';
const WALL_DISCONNECT = 'Wall::Disconnect';

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
    this.socket = socket;
    this.wss = websocketServer;
    this.userIdQueue = [];
    this.wallQueue = [];
    // this.getWall();
    // this.createUser();
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
      [INITIALIZATION]: (income) => {
        log.debug('Initializtion message received ', income);
      },
      [AUTH_ANON]: async ({ userId, jwt }) => {
        // TODO: authenticate in db if it has some token/session_id
        // if (userId) {
        //   this.userId = userId;
        //   log.debug('Auth anon with existing user id: ', userId);
        //   this.sendBack(AuthAnonOk, { id: userId });
        //   return;
        // }
        try {
          const newUser = await this.createUser();
          log.debug('New user that will be sent: ', newUser);
          this.sendBack(AuthAnonOk, newUser);
        } catch (e) {
          log.error('Failed to create anon user ', e);
          this.sendBack(AUTH_ANON_ERR, { message: e.message });
        }
      },
      [AUTH_LOGIN]: async ({ userId, jwt }) => {
        // TODO: delete anon user if present
      },
      [AUTH_SIGN_UP]: (income) => {
        // TODO: check if user with same login is present
        // TODO: delete anon user if present
      },
      [WALL_CONNECT]: async ({ userId, city }) => {
        // NOTE: can get city-to-wallId lookup table at client boot with
        // separate request
        let id = userId;

        if (!id) {
          const [err, newAnonUser] = await UserController.createAnon();

          if (err) {
            log.error('Cant connect to wall ', err);
            this.sendBack(WALL_CONNECT_ERR, { message: err.message });
            return;
          }

          ({ id } = newAnonUser);
          log.debug('New anon user id ', id);
          this.sendBack(AuthAnonOk, { id });
        }
        const [err, wall] = await WallController.addSubscribers(id, city);

        if (err) {
          log.error('Cant connect to wall ', err);
          this.sendBack(WALL_CONNECT_ERR, { message: err.message });
        } else {
          log.debug('Connected to wall with id and city ', wall.id, city);
          this.sendBack(JoinWallOk, { wallId: wall.id, city: wall.city });
        }
      },
      // .catch(), /* do something */
      [WALL_DISCONNECT]: ({ userId, wallId }) => this.getWall(wallId)
        .then(wall => wall.unsubscribe(userId)),
      // [JOIN_WALL]: () => Promise.all([this.getWall(), this.createUser()])
      //   .then(([wall, userId]) => wall.subscribe(userId)),
      // [LEAVE_WALL]: () => this.getWall()
      //   .then((wall) => {
      //     return this.createUser()().then((userId) => {
      //       return ({ wall, userId });
      //     });
      //   })
      //   .then(({ wall, userId }) => {
      //     return wall.unsubscribe(userId);
      //   }),
      [MESSAGE]: income => this.resendMessageToAll(socket, income),
      [IS_TYPING]: income => this.sendTypingNotification(socket, income),
      [PING]: () => this.sendPong(socket),
      [CHANGE_NAME]: () => {},
      [DELETE_CHAT]: income => this.removeChat(income),
      [OPEN_CHAT]: income => this.createChat(socket, income),
      [LEAVE_CHAT]: () => {},
      [HAS_ID]: income => console.log('Has userId: ', income.userId),
    };
    // apply handlers to socket events
    Object.keys(this.socketEventHandlers).forEach((eventName) => {
      socket.on(eventName, (data) => {
        log.debug(
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

  async createUser(params) {
    if (params) {
      // TODO: create usual user
    }
    if (this.userId) {
      // TODO: get user by id
      // return this.userId;
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
      return newUser;
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
    let income = null;

    try {
      income = JSON.parse(rawIncoming);
    } catch (e) {
      log.error('Failed to parse income JSON ', e);
    }

    if (!income || !validator.validateIncoming(income)) {
      return;
    }
    // const { key, userId } = income; // if userId is stored on client
    const { key } = income;

    if (!this.socketEventHandlers.hasOwnProperty(key)) {
      log.error('Unknown key of income message');
    } else if (!this.userId) { // !userId - if userId is stored on client
      this.createUser()()
        // .then(id => this.socket.send({ key: INITIALIZATION, userId: id }))
        .then(() => this.socketEventHandlers[key](income));
      // catch() do something if failed, repeat or whatever needed
    } else {
      // this.userId = userId; // if userId is stored on client
      this.socketEventHandlers[key](income);
    }
  }

  handleClose() {
    log.debug('Disconnected, current user id: ', this.userId);
    if (this.userId) {
      UserController.deleteAnonUserById(this.userId);
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
  //     [SIGN_IN]: (income) => {
  //       const authData = user.signIn(income.login);
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
  //     [SIGN_UP]: (income) => {
  //       // TODO: check if user with same login is present
  //       const newUser = user.signUp(income.login);
  //       this.userId = newUser.id;
  //       this.socket.send(JSON.stringify({
  //         key: SIGN_UP, userId: this.userId, token: newUser.token,
  //       }));
  //     },
  //     [JOIN_WALL]: () => Promise.all([this.getWall(), this.createUser()()])
  //       .then(([wall, userId]) => wall.subscribe(userId)),
  //     // .catch(), /* do something */
  //     [LEAVE_WALL]: () => this.getWall()
  //       .then((wall) => {
  //         return this.createUser()().then((userId) => {
  //           return ({ wall, userId });
  //         });
  //       })
  //       .then(({ wall, userId }) => {
  //         return wall.unsubscribe(userId);
  //       }),
  //     [MESSAGE]: income => this.resendMessageToAll(socket, income),
  //     [IS_TYPING]: income => this.sendTypingNotification(socket, income),
  //     [PING]: () => this.sendPong(socket),
  //     [CHANGE_NAME]: () => {},
  //     [DELETE_CHAT]: income => this.removeChat(income),
  //     [OPEN_CHAT]: income => this.createChat(socket, income),
  //     [LEAVE_CHAT]: () => {},
  //     [HAS_ID]: () => console.log('Has userId: ', userId),
  //   };
  //
  //   // this function will become this.handleSpecificMessageType
  //   return (key, income) => {
  //     if (messageTypesMap.hasOwnProperty(key)) {
  //       messageTypesMap[key](income);
  //     } else {
  //       console.error('Unknown key of income message');
  //     }
  //   };
  // }
}

module.exports = WebsocketConnection;
