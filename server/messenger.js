// const Chat = require('./chat');
// const Client = require('./client');
const ws = require('ws');
const shortid = require('shortid');
const throttle = require('lodash.throttle');

const THROTTLE_WAIT = 1000;

// TODO: chats must be stored in Chat module, near his model
let chats = {
  // chat1: {
  //   participants: []
  // },
  // chat2: {
  //   participants: []
  // }
}; 

// TODO: clients must be stored in Chat module, near his model
let clients = {
  // wadwad: {
  //   websocket,
  //   chats: ['chatid1', 'chatid2']
  // },
  // awd234: {
  //   websocket,
  //   chats: ['chatid1', 'chatid2']
  // }
};

const validateIncomingData = (dataToCheck) => {
  // TODO: complete it later, temporary return as is
  // NOTE: validator, xss-filters, DOMPurify
  return dataToCheck;
};

// Make it abstract-like and use static methods
class Messenger {
  handleIncoming(rawIncoming, websocket) {
    // this.websocket = websocket || this.websocket;

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
    let newClientId;

    switch (type) {
      case 'GET_ID':
        newClientId = this.assignNewId();
        this.createClient(newClientId);

        // if (this.wss.clients.size > 1) {
        //   this.wss.clients.forEach((client) => {
        //     if (client !== this.websocket) {
        //       this.createChat(client);
        //     }
        //   });
        // }
        if (this.wss.clients.size > 1) {
          Object.keys(clients).forEach((clientId) => {
            if (clientId !== newClientId) {
              this.createChat(newClientId, clientId);
            }
          });
        }
        break;
      // case 'HAS_ID':
      //   console.log('Has clientId: ', clientId);
      //   break;
      case 'MESSAGE':
        this.resendMessageToAll(websocket, incoming);
        break;
      case 'IS_TYPING':
        this.sendTypingNotification(websocket, incoming);
        break;
      case 'PING':
        this.sendPong(websocket);
        break;
      case 'CHANGE_NAME':
        break;
      case 'OPEN_CHAT':
        this.createChat(websocket, incoming);
        break;
      case 'LEAVE_CHAT':
        break;
      default:
        console.error('Unknown type of incoming message');
    }
  }

  assignNewId(websocket = this.websocket) {
    const clientId = shortid.generate();

    this.sendToOne(websocket, {
      clientId,
      type: 'SET_ID'
    });

    return clientId;
  }

  createClient(newClientId, websocket = this.websocket) {
    const clientsUpdate = {};
    const newClient = { // OR Client.assignId() OR new Client() => new id
      websocket,
      chats: []
    };

    clientsUpdate[newClientId] = newClient;
    clients = Object.assign(clients, clientsUpdate);

    return newClient;
  }

  // createChat(participant, websocket = this.websocket) {
  //   const chatsUpdate = {};
  //   // const chat = Chat.create(websocket, client);
  //   const newChat = {
  //     participants: [websocket, participant]
  //   };
  //   const newChatId = shortid.generate();

  //   chatsUpdate[newChatId] = newChat;
  //   chats = Object.assign(chats, chatsUpdate);

  //   // messenger.addChat(chat);
  //   // newClient.chats.push(chat);

  //   newChat.participants.forEach(socket => (
  //     socket.send(JSON.stringify({
  //       type: 'ADD_CHAT',
  //       chatId: newChatId
  //     }))
  //   ));
  // }

  /* eslint-disable class-methods-use-this */
  createChat(newClientId, participantId) {
    const chatsUpdate = {};
    // const chat = Chat.create(websocket, client);
    const newChat = {
      participants: [newClientId, participantId]
    };
    const newChatId = shortid.generate();

    chatsUpdate[newChatId] = newChat;
    chats = Object.assign(chats, chatsUpdate);

    // messenger.addChat(chat);
    // newClient.chats.push(chat);

    newChat.participants.forEach(clientId => (
      clients[clientId].websocket.send(JSON.stringify({
        type: 'ADD_CHAT',
        chatId: newChatId,
        participants: [newClientId, participantId]
      }))
    ));
  }

  sendPong(websocket = this.client) {
    console.log('get ping from client, send pong');
    this.sendToOne(websocket, {
      type: 'PONG'
    });
  }

  sendToOne(websocket = this.client, dataToSend) {
    websocket.send(JSON.stringify(dataToSend), (e) => {
      if (e) {
        console.log('Failed to send data to one client: ', e);
      }
      console.log('Next data was sent to one client: ', dataToSend);
    });
  }

  // send to everyone else
  broadcast(websocket = this.client, outgoing) {
    // TODO: remove
    const thisMoment = Date.now();
    console.log('Sending: ', thisMoment - this.sendLap);
    this.sendLap = thisMoment;

    this.wss.clients.forEach((client) => {
      if (client === websocket) {
        console.log('Same clients item, clients size: ', this.wss.clients.size);
        return;
      }
      if (client.readyState === ws.OPEN) {
        client.send(outgoing);
      } else {
        console.log('Unable to send data, websocket readyState is not open');
      }
    });
  }

  resendMessageToAll(websocket = this.client, incoming) {
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

    this.broadcast(websocket, outgoing);
  }

  sendTypingNotification(websocket = this.client, incoming) {
    // NOTE: this method is added for further additional processing of incoming
    // const { clientId, nickname, type } = incoming;
    //
    // const outgoing = JSON.stringify({
    //   clientId,
    //   nickname,
    //   type
    // });
    //
    // this.broadcast(websocket, outgoing);

    // TODO: remove
    const thisMoment = Date.now();

    console.log('Typing notification interval: ', thisMoment - this.lap);
    this.lap = thisMoment;
    this.throttledBroadcast(websocket, JSON.stringify(incoming));
  }
}

// function addChat() {

// }

// function removeChat() {

// }

// function addClient() {

// }

// function removeClient() {

// }

exports.Messenger = Messenger;
