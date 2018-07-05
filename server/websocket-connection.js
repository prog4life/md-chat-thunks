const Wall = require('./models/Wall');
const User = require('./models/User');
const { logger } = require('./loggers');
// const user = require('./user');
// const wall = require('./wall');

const GET_ID = 'GET_ID';
const SET_ID = 'SET_ID';
const SIGN_IN = 'SIGN_IN';
const SIGN_UP = 'SIGN_UP';
// const JOIN_THE_WALL = 'JOIN-THE-WALL';
const JOIN_WALL = 'Join_Wall';
const LEAVE_WALL = 'Leave_Wall';
const MESSAGE = 'MESSAGE';
const IS_TYPING = 'IS_TYPING';
const PING = 'PING';
const CHANGE_NAME = 'CHANGE_NAME';
const DELETE_CHAT = 'DELETE_CHAT';
const OPEN_CHAT = 'OPEN_CHAT';
const LEAVE_CHAT = 'LEAVE_CHAT';
const HAS_ID = 'HAS_ID';

const validator = {
  validateIncoming() { return true; },
};

class WebsocketConnection {
  constructor(websocket, websocketServer) {
    this.ws = websocket;
    this.wss = websocketServer;
    this.clientIdQueue = [];
    this.wallQueue = [];
    this.incomingMessageHandlers = {
      // [GET_ID]: () => {
      //   // const newClient = client.addOne(websocket);
      //   // // send back to client his new id
      //   // this.sendNewClientId(newClient.id, websocket);
      //   // // create chats between new client and each other
      //   // this.createChats(newClient.id);
      //   this.clientId = user.assignId();
      //   this.ws.send(JSON.stringify({ type: SET_ID, clientId: this.clientId }));
      // },
      [SIGN_IN]: (incoming) => {
        const authData = user.signIn(incoming.login);

        if (authData) {
          // TODO: create user id on connection and just add login/token on
          // sign in/sign up OR this.changeId with resubscribing to wall
          // this.clientId = authData.id;
          this.changeId(authData.id);
          this.ws.send(JSON.stringify({
            type: SIGN_IN, clientId: authData.id, token: authData.token,
          }));
        } else {}
        // TODO: send fail message, perhaps without token with reason
      },
      [SIGN_UP]: (incoming) => {
        // TODO: check if user with same login is present
        const newUser = user.signUp(incoming.login);
        this.clientId = newUser.id;
        this.ws.send(JSON.stringify({
          type: SIGN_UP, clientId: this.clientId, token: newUser.token,
        }));
      },
      [JOIN_WALL]: () => Promise.all([this.getWall(), this.getClientId()])
        .then(([wall, clientId]) => wall.subscribe(clientId)),
      // .catch(), /* do something */
      [LEAVE_WALL]: () => this.getWall()
        .then((wall) => {
          return this.getClientId().then((clientId) => {
            return ({ wall, clientId });
          });
        })
        .then(({ wall, clientId }) => {
          return wall.unsubscribe(clientId);
        }),
      [MESSAGE]: incoming => this.resendMessageToAll(websocket, incoming),
      [IS_TYPING]: incoming => this.sendTypingNotification(websocket, incoming),
      [PING]: () => this.sendPong(websocket),
      [CHANGE_NAME]: () => {},
      [DELETE_CHAT]: incoming => this.removeChat(incoming),
      [OPEN_CHAT]: incoming => this.createChat(websocket, incoming),
      [LEAVE_CHAT]: () => {},
      [HAS_ID]: incoming => console.log('Has clientId: ', incoming.clientId),
    };

    this.getWall();
    this.getClientId();
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
  async getClientId() {
    if (this.clientId) {
      return this.clientId;
    }
    // store promise to prevent duplicated queries for new user creation
    // need to create only one user for single connection
    let newUser;

    if (this.clientIdPromise) {
      newUser = await this.clientIdPromise;
    } else {
      const clientIdPromise = User.createOne();

      this.clientIdPromise = clientIdPromise;
      newUser = await clientIdPromise;
    }
    this.clientIdPromise = null;

    this.clientId = newUser.id;
    return newUser.id;
  }
  changeId(newId) {
    if (wall.isSubscriber(this.clientId)) {
      wall.replaceSubscriber(this.clientId, newId);
    }
    this.clientId = newId;
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
    const { type } = incoming;

    if (this.incomingMessageHandlers.hasOwnProperty(type)) {
      this.incomingMessageHandlers[type](incoming);
    } else {
      logger.error('Unknown type of incoming message');
    }
  }
  handleClose() {
    if (this.clientId) {
      User.deleteOneById(this.clientId); // TEMP:
    }
    if (this.wall && this.clientId) {
      this.wall.unsubscribe(this.clientId);
    }
    // user.signOut(this.clientId);
  }
  // call it from constructor
  // setMessageTypeHandlers() {
  //   const messageTypesMap = {
  //     // [GET_ID]: () => {
  //     //   // const newClient = client.addOne(websocket);
  //     //   // // send back to client his new id
  //     //   // this.sendNewClientId(newClient.id, websocket);
  //     //   // // create chats between new client and each other
  //     //   // this.createChats(newClient.id);
  //     //   this.clientId = user.assignId();
  //     //   this.ws.send(JSON.stringify({ type: SET_ID, clientId: this.clientId }));
  //     // },
  //     [SIGN_IN]: (incoming) => {
  //       const authData = user.signIn(incoming.login);
  //
  //       if (authData) {
  //         // TODO: create user id on connection and just add login/token on
  //         // sign in/sign up OR this.changeId with resubscribing to wall
  //         // this.clientId = authData.id;
  //         this.changeId(authData.id);
  //         this.ws.send(JSON.stringify({
  //           type: SIGN_IN, clientId: authData.id, token: authData.token,
  //         }));
  //       } else {}
  //       // TODO: send fail message, perhaps without token with reason
  //     },
  //     [SIGN_UP]: (incoming) => {
  //       // TODO: check if user with same login is present
  //       const newUser = user.signUp(incoming.login);
  //       this.clientId = newUser.id;
  //       this.ws.send(JSON.stringify({
  //         type: SIGN_UP, clientId: this.clientId, token: newUser.token,
  //       }));
  //     },
  //     [JOIN_WALL]: () => Promise.all([this.getWall(), this.getClientId()])
  //       .then(([wall, clientId]) => wall.subscribe(clientId)),
  //     // .catch(), /* do something */
  //     [LEAVE_WALL]: () => this.getWall()
  //       .then((wall) => {
  //         return this.getClientId().then((clientId) => {
  //           return ({ wall, clientId });
  //         });
  //       })
  //       .then(({ wall, clientId }) => {
  //         return wall.unsubscribe(clientId);
  //       }),
  //     [MESSAGE]: incoming => this.resendMessageToAll(websocket, incoming),
  //     [IS_TYPING]: incoming => this.sendTypingNotification(websocket, incoming),
  //     [PING]: () => this.sendPong(websocket),
  //     [CHANGE_NAME]: () => {},
  //     [DELETE_CHAT]: incoming => this.removeChat(incoming),
  //     [OPEN_CHAT]: incoming => this.createChat(websocket, incoming),
  //     [LEAVE_CHAT]: () => {},
  //     [HAS_ID]: () => console.log('Has clientId: ', clientId),
  //   };
  //
  //   // this function will become this.handleSpecificMessageType
  //   return (type, incoming) => {
  //     if (messageTypesMap.hasOwnProperty(type)) {
  //       messageTypesMap[type](incoming);
  //     } else {
  //       console.error('Unknown type of incoming message');
  //     }
  //   };
  // }
}

module.exports = WebsocketConnection;
