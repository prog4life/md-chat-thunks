const user = require('./user');
const wall = require('./wall');

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

class ConnectionManager {
  constructor(websocket, websocketServer) {
    this.ws = websocket;
    this.wss = websocketServer;
    this.handleSpecificMessageType = this.mapMessageTypeHandlers();
  }
  mapMessageTypeHandlers() {
    const messageTypesMap = {
      [GET_ID]: () => {
        // const newClient = client.addOne(websocket);
        // // send back to client his new id
        // this.sendNewClientId(newClient.id, websocket);
        // // create chats between new client and each other
        // this.createChats(newClient.id);
        const newId = user.assignId();
        this.ws.send(JSON.stringify({ type: SET_ID, clientId: newId }));
      },
      [SIGN_IN]: (incoming) => {
        const existingUser = user.signIn(incoming.login);

        if (existingUser) {
          this.ws.send(JSON.stringify({ type: SIGN_IN, clientId: existingUser.id }));
        } else {
          const newUser = user.signUp(incoming.login);
          this.ws.send(JSON.stringify({ type: SIGN_UP, clientId: newUser.id }));
        }
      },
      [JOIN_WALL]: incoming => wall.subscribe(incoming.clientId),
      [LEAVE_WALL]: incoming => wall.unsubscribe(incoming.clientId),
      [MESSAGE]: incoming => this.resendMessageToAll(websocket, incoming),
      [IS_TYPING]: incoming => this.sendTypingNotification(websocket, incoming),
      [PING]: () => this.sendPong(websocket),
      [CHANGE_NAME]: () => {},
      [DELETE_CHAT]: incoming => this.removeChat(incoming),
      [OPEN_CHAT]: incoming => this.createChat(websocket, incoming),
      [LEAVE_CHAT]: () => {},
      [HAS_ID]: () => console.log('Has clientId: ', clientId),
    };

    // this function will become this.handleSpecificMessageType
    return (type, incoming) => {
      if (messageTypesMap.hasOwnProperty(type)) {
        return messageTypesMap[type](incoming);
      }
      console.error('Unknown type of incoming message');
      return null;
    };
  }
  handleIncoming(rawIncoming) {
    let incoming = null;

    try {
      incoming = JSON.parse(rawIncoming);
    } catch (e) {
      console.error('Failed to parse incoming json ', e);
    }

    if (!incoming || !validator.validateIncoming(incoming)) {
      return;
    }
    const { type } = incoming;

    this.handleSpecificMessageType(type, incoming);
  }
}

module.exports = ConnectionManager;
