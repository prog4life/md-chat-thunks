const GET_ID = 'GET_ID';
const MESSAGE = 'MESSAGE';
const IS_TYPING = 'IS_TYPING';
const PING = 'PING';
const CHANGE_NAME = 'CHANGE_NAME';
const DELETE_CHAT = 'DELETE_CHAT';
const OPEN_CHAT = 'OPEN_CHAT';
const LEAVE_CHAT = 'LEAVE_CHAT';
const HAS_ID = 'HAS_ID';

const validator = {
  validateIncoming() {},
};

class ConnectionManager {
  constructor(websocket) {
    this.ws = websocket;
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

exports.ConnectionManager = ConnectionManager;
// export.handleConnection = (websocket) => {};
