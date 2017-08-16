const websocket = require('ws');
const shortid = require('shortid');

let chatInstance = null;

/* eslint consistent-this: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint class-methods-use-this: 0 */
class WebsocketChat {
  constructor() {
    if (!chatInstance) {
      chatInstance = this;
    }
    return chatInstance;
  }

  setWebsocketServer(wss) {
    // TODO: do something if wss already present
    this.wss = wss;
  }

  handleIncomingData(ws, rawIncoming) {
    const incoming = this.parseIncomingJSON(rawIncoming);

    if (!this.validateIncomingData(incoming)) {
      return;
    }
    const {id, name, message, type} = incoming;

    switch (type) {
      case 'GET_ID':
        this.giveNewId(ws);
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
        console.error('Unknown incoming message type, default case');
    }
  }

  assignNewId(ws) {
    // TODO: replace by uuid
    const id = shortid.generate();

    ws.send(JSON.stringify({
      id,
      type: 'SET_ID'
    }), (e) => {
      if (e) {
        console.log('send id error: ', e);
      }
      console.log('new id sent: ', id);
    });
  }

  // broadcast to everyone else
  broadcast(ws, outgoing) {
    this.wss.clients.forEach((client) => {
      if (client === ws) {
        console.log('broadcast ws and client are same');
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
    const {id, name, message, type} = incoming;

    // TODO: validate incoming
    const outgoing = JSON.stringify({
      id,
      name,
      message,
      type
    });

    this.broadcast(ws, outgoing);
  }

  sendTypingNotification(ws, incoming) {
    const {id, name, type} = incoming;

    // TODO: validate incoming

    const outgoing = JSON.stringify({
      id,
      name,
      type
    });

    this.broadcast(ws, outgoing);
  }

  validateIncomingData(dataToCheck) {
    // TODO: refactor this, temporary return as is
    return dataToCheck;

    // TODO: pass here obj with only props that must be not falsy, and loop
    // over them to check each

    // if (typeof id !== 'string' || id === '') {
    //   console.error('Incorrect incoming id');
    //   return;
    // }
    //
    // if (typeof message !== 'string' || message === '') {
    //   console.error('Incorrect incoming message');
    //   return;
    // }
    //
    // if (typeof name !== 'string' || name === '') {
    //   console.error('Incorrect incoming name');
    //   return;
    // }
  }

  // TODO: replace out of this file
  parseIncomingJSON(json) {
    let parsed = null;

    try {
      parsed = JSON.parse(json);
    } catch (e) {
      console.error(e);
    }
    return parsed;
  }
}

exports.createChat = () => new WebsocketChat();
exports.WebsocketChat = WebsocketChat;
