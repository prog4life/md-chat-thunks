const websocket = require('ws');
const shortid = require('shortid');

let chatInstance = null;

class WebsocketChat {
  constructor(websocketServer) {
    this.setWebsocketServer(websocketServer);

    if (!chatInstance) {
      chatInstance = this;
    }
    return chatInstance;
  }

  setWebsocketServer(wss) {
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

    if (!incoming || !WebsocketChat.validateIncomingData(incoming)) {
      return;
    }
    const { clientId, type } = incoming;

    switch (type) {
      case 'GET_ID':
        // TODO: change back to WebsocketChat
        this.constructor.assignNewId(ws);
        break;
      case 'HAS_ID':
        console.log('Has clientId: ', clientId);
        break;
      case 'MESSAGE':
        this.resendMessageToAll(ws, incoming);
        break;
      case 'IS_TYPING':

        // TODO: add throttle with timeout to prevent too frequent notifications

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
    // NOTE: this method is added for future case of resending not
    // whole incoming, but some part of it
    const { clientId, nickname, text, type } = incoming;

    const outgoing = JSON.stringify({
      clientId,
      nickname,
      text,
      type
    });

    this.broadcast(ws, outgoing);
  }

  sendTypingNotification(ws, incoming) {
    // NOTE: this method is added for future case of resending not
    // whole incoming, but some part of it
    const { clientId, nickname, type } = incoming;

    const outgoing = JSON.stringify({
      clientId,
      nickname,
      type
    });

    this.broadcast(ws, outgoing);
  }

  static validateIncomingData(dataToCheck) {
    // TODO: complete it later, temporary return as is
    return dataToCheck;

    // NOTE: validator, xss-filters, DOMPurify
  }
}

exports.create = websocketServer => new WebsocketChat(websocketServer);
exports.WebsocketChat = WebsocketChat;
