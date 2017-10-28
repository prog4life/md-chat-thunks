const websocket = require('ws');
const shortid = require('shortid');

let chatInstance = null;

class WebsocketChat {
  constructor() {
    if (!chatInstance) {
      chatInstance = this;
    }
    return chatInstance;
  }

  setWebsocketServer(wss) {
    // TODO: do something if wss is present already
    if (!this.wss) {
      this.wss = wss;
      return;
    }
    this.wss.close(() => {
      this.wss = wss;
    });
  }

  handleIncomingData(ws, rawIncoming) {
    let incoming = null;
    try {
      incoming = JSON.parse(rawIncoming);
    } catch (e) {
      console.error('Failed to parse incoming json ', e);
    }
    // TODO: resolve static method call with class name
    if (!incoming || !this.constructor.validateIncomingData(incoming)) {
      return;
    }
    const { clientId, type } = incoming;

    switch (type) {
      case 'GET_ID':
        // TODO: resolve static method call with this.constructor
        this.constructor.assignNewId(ws);
        break;
      case 'HAS_ID':
        // NOTE: to save as part User's data
        console.log('Has clientId: ', clientId);
        break;
      case 'MESSAGE':
        this.resendMessageToAll(ws, incoming);
        break;
      case 'IS_TYPING':
        this.sendTypingNotification(ws, incoming);
        break;
      case 'JOIN_CHAT':
        break;
      case 'LEAVE_CHAT':
        break;
      case 'CHANGE_NAME':
        break;
      default:
        console.error('Unknown type of incoming message');
    }
  }

  static assignNewId(ws) {
    const clientId = shortid.generate();

    ws.send(JSON.stringify({
      clientId,
      type: 'SET_ID'
    }), (e) => {
      if (e) {
        console.log('clientId sending error: ', e);
      }
      console.log('new clientId sent: ', clientId);
    });
  }

  // broadcast to everyone else
  broadcast(ws, outgoing) {
    this.wss.clients.forEach((client) => {
      if (client === ws) {
        console.log('Same clients item, clients size: ', this.wss.clients.size);
        return;
      }
      if (client.readyState === websocket.OPEN) {
        client.send(outgoing);
      } else {
        console.log('Unable to send data, websocket readyState is not open');
      }
    });
  }

  resendMessageToAll(ws, incoming) {
    const { clientId, nickname, text, type } = incoming;

    // TODO: validate incoming
    const outgoing = JSON.stringify({
      clientId,
      nickname,
      text,
      type
    });

    this.broadcast(ws, outgoing);
  }

  sendTypingNotification(ws, incoming) {
    const { clientId, nickname, type } = incoming;

    // TODO: validate incoming

    const outgoing = JSON.stringify({
      clientId,
      nickname,
      type
    });

    this.broadcast(ws, outgoing);
  }

  static validateIncomingData(dataToCheck) {
    // TODO: refactor this, temporary return as is
    return dataToCheck;

    // TODO: pass here obj with only props that must be not falsy, and loop
    // over them to check each

    // if (typeof clientId !== 'string' || clientId === '') {
    //   console.error('Incorrect value of clientId property of incoming message');
    //   return;
    // }
    //
    // if (typeof text !== 'string' || text === '') {
    //   console.error('Incorrect value of text property of incoming message');
    //   return;
    // }
    //
    // if (typeof nickname !== 'string' || nickname === '') {
    //   console.error('Incorrect value of nickname property of incoming message');
    //   return;
    // }
  }
}

exports.createChat = () => new WebsocketChat();
exports.WebsocketChat = WebsocketChat;
