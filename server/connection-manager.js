const user = require('./user');

const GET_ID = 'GET_ID';
const SIGN_IN = 'SIGN_IN';
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
        const newClient = client.addOne(websocket);
        // send back to client his new id
        this.sendNewClientId(newClient.id, websocket);
        // create chats between new client and each other
        this.createChats(newClient.id);
      },
      [SIGN_IN]: (incoming) => {
        const existingUser = user.signIn(incoming.login);

        if (existingUser) {
          this.ws.send(JSON.stringify({ type: 'LOGGED_IN', clientId: existingUser.id }));
        } else {
          const newUser = user.signUp(incoming.login);
          // TODO: change to SIGNED_UP
          this.ws.send(JSON.stringify({ type: 'SET_ID', clientId: newUser.id }));
        }
      },
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
      if (type in messageTypesMap) {
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
// export.handleConnection = (websocket) => {};
