const websocket = require('ws');
const shortid = require('shortid');
const throttle = require('lodash.throttle');

const THROTTLE_WAIT = 1000;

const validateIncomingData = (dataToCheck) => {
  // TODO: complete it later, temporary return as is
  // NOTE: validator, xss-filters, DOMPurify
  return dataToCheck;
};

let chatInstance = null;

class WebsocketChat {
  constructor(websocketServer) {
    this.setWebsocketServer(websocketServer);
    // has cancel method
    this.throttledBroadcast = throttle(
      this.broadcast,
      THROTTLE_WAIT,
      { leading: true, trailing: false }
    );
    this.lap = Date.now();
    this.sendLap = Date.now();

    if (!chatInstance) {
      chatInstance = this;
    }
    return chatInstance;
  }

  setWebsocketServer(wss) {
    if (this.wss) {
      this.wss.close(() => {
        console.log('websocket server was closed');
      });
    }
    this.wss = wss;
  }

  handleIncomingData(ws = this.client, rawIncoming) {
    this.client = ws;

    let incoming = null;
    try {
      incoming = JSON.parse(rawIncoming);
    } catch (e) {
      console.error('Failed to parse incoming json ', e);
    }

    if (!incoming || !validateIncomingData(incoming)) {
      return;
    }
    const { type } = incoming;

    switch (type) {
      case 'GET_ID':
        this.assignNewId(ws);
        break;
      // case 'HAS_ID':
      //   console.log('Has clientId: ', clientId);
      //   break;
      case 'MESSAGE':
        this.resendMessageToAll(ws, incoming);
        break;
      case 'IS_TYPING':
        this.sendTypingNotification(ws, incoming);
        break;
      case 'PING':
        this.sendPong(ws);
        break;
      case 'CHANGE_NAME':
        break;
      case 'OPEN_CHAT':
        this.createChat(ws, incoming);
        break;
      case 'LEAVE_CHAT':
        break;
      default:
        console.error('Unknown type of incoming message');
    }
  }

  assignNewId(ws = this.client) {
    const clientId = shortid.generate();

    this.sendToOne(ws, {
      clientId,
      type: 'SET_ID'
    });
  }

  createChat(ws = this.client, incomingData) {
    const newChat = {
      participants: [incomingData.clientId, incomingData.interlocutor]
    };
    const newChatId = shortid.generate();
    this.chats[newChatId] = newChat;
  }

  sendPong(ws = this.client) {
    console.log('get ping from client, send pong');
    this.sendToOne(ws, {
      type: 'PONG'
    });
  }

  sendToOne(ws = this.client, dataToSend) {
    ws.send(JSON.stringify(dataToSend), (e) => {
      if (e) {
        console.log('Failed to send data to one client: ', e);
      }
      console.log('Next data was sent to one client: ', dataToSend);
    });
  }

  // send to everyone else
  broadcast(ws = this.client, outgoing) {
    // TODO: remove
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

  resendMessageToAll(ws = this.client, incoming) {
    // NOTE: this method is added for further additional processing of incoming
    const {
      id, clientId, nickname, text, type
    } = incoming;

    const outgoing = JSON.stringify({
      id,
      clientId,
      nickname,
      text,
      type
    });

    this.broadcast(ws, outgoing);
  }

  sendTypingNotification(ws = this.client, incoming) {
    // NOTE: this method is added for further additional processing of incoming
    // const { clientId, nickname, type } = incoming;
    //
    // const outgoing = JSON.stringify({
    //   clientId,
    //   nickname,
    //   type
    // });
    //
    // this.broadcast(ws, outgoing);

    // TODO: remove
    const thisMoment = Date.now();

    console.log('Typing notification interval: ', thisMoment - this.lap);
    this.lap = thisMoment;
    this.throttledBroadcast(ws, JSON.stringify(incoming));
  }
}

exports.create = websocketServer => new WebsocketChat(websocketServer);
exports.WebsocketChat = WebsocketChat;
