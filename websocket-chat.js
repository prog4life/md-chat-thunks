const websocket = require('ws');
const shortid = require('shortid');
const throttle = require('lodash/throttle');

const THROTTLE_WAIT = 1000;

let chatInstance = null;

class WebsocketChat {
  constructor(websocketServer) {
    this.setWebsocketServer(websocketServer);
    // has cancel method
    this.throttledBroadcast = this.throttleBroadcast(THROTTLE_WAIT);
    this.lap = Date.now();
    this.sendLap = Date.now();

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
    // TODO: remove
    const thisMoment = Date.now();

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
        console.log('Typing notification interval: ', thisMoment - this.lap);
        this.lap = thisMoment;
        // this.sendTypingNotification(ws, incoming);
        // throttle(this.broadcast, THROTTLE_WAIT)(ws, JSON.stringify(incoming));
        this.throttledBroadcast(ws, JSON.stringify(incoming));
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
    const thisMoment = Date.now();
    console.log('Sending: ', thisMoment - this.sendLap);
    this.sendLap = thisMoment;

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

  throttleBroadcast(wait, options = { leading: true, trailing: false }) {
    return throttle(this.broadcast, wait, options);
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
