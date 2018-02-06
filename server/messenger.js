const ws = require('ws');
const throttle = require('lodash.throttle');
const chat = require('./chat');
const client = require('./client');
const { chats } = require('./chat');
const { clients } = require('./client');

const THROTTLE_WAIT = 1000;

let messages = {
  // 'messageId1': {
  //   id: 'messageId1',
  //   from: 'clientId1',
  //   to: ['clientId2'],
  //   status: 'SENT', // 'DELIVERED', 'SEEN'
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

    let newClient;

    switch (type) {
      case 'GET_ID':
        newClient = client.addOne(websocket);
        // send back to client his new id
        this.sendNewClientId(newClient.id, websocket);
        // create chats between new client and each other
        this.createChats(newClient.id);
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

  /* eslint-disable class-methods-use-this */
  sendNewClientId(clientId, websocket) {
    this.sendToOne(websocket, {
      type: 'SET_ID',
      clientId
    });
  }

  createChats(newClientId) {
    if (this.wss.clients.size > 1) {
      // NOTE: probably "clients" should be replaced by getClients()
      Object.keys(clients).forEach((clientId) => {
        if (clientId !== newClientId) {
          this.createChat([newClientId, clientId]);
        }
      });
    }
  }

  createChat(participants) {
    const newChat = chat.addOne(participants);

    participants.forEach((clientId) => {
      // NOTE: probably "clients" should be replaced by getClients()
      const currentClient = clients[clientId];

      this.sendToOne(currentClient.websocket, {
        type: 'ADD_CHAT',
        chatId: newChat.id,
        // currentClient's own id is not included
        participants: participants.filter(id => id !== clientId)
      });

      currentClient.chats.push(newChat.id);
    });
  }

  // removeChats(websocket) {
  //   let chatsToRemove;

  //   Object.keys(clients).forEach((clientId) => {
  //     const client = clients[clientId];
  //     // client which socket was closed
  //     if (client.websocket === websocket) {
  //       chatsToRemove = [...client.chats];
  //       chatsToRemove.forEach((chatId) => {
  //         // remove chats related to client which socket was closed
  //         delete chats[chatId];
  //       });
  //       client.chats = [];
  //     }
  //     // remove closed chats from other clients
  //     client.chats = client.chats.filter((chatId) => {
  //       if (chatsToRemove.include(chatId)) {

  //       }
  //     });
  //     // clients which sockets were not closed
  //   });
  // }

  removeChat(chatId, clientId) {
    // NOTE: probably "clients" should be replaced by getClients()
    clients[clientId].chats.filter(id => id !== chatId);

    // NOTE: probably "chats" should be replaced by getChats()
    const { participants } = chats[chatId];

    // if all clients have deleted chat with such id, remove it completely
    // NOTE: probably "clients" should be replaced by getClients()
    if (participants.every(id => !clients[id].chats.include(chatId))) {
      chat.deleteOne(chatId);
    }
  }

  // TODO: change to disconnectClient later, and set connected: false
  removeClient(websocket) {
    console.log('--- removeClient start clients ---');
    console.log.apply(null, Object.keys(clients));
    console.log('--- removeClient start getClients() ---');
    const clts = client.getClients();
    console.log(clts);
    // NOTE: probably "clients" should be replaced by getClients()
    Object.keys(clients).forEach((clientId) => {
      const currentClient = clients[clientId];
      // client which socket was closed
      if (currentClient.websocket === websocket) {
        client.deleteOne(clientId);
      }
    });
    console.log('--- removeClient end clients ---');
    console.log.apply(null, Object.keys(clients));
    console.log('--- removeClient end getClients() ---');
    const clts2 = client.getClients();
    console.log(clts2);
  }

  sendPong(websocket) {
    console.log('get ping from client, send pong');
    this.sendToOne(websocket, {
      type: 'PONG'
    });
  }

  // sendToEach(websockets, dataToSend) {
  //   websockets.forEach((socket) => {
  //     socket.send(JSON.stringify(dataToSend), (e) => {
  //       if (e) {
  //         console.log('Failed to send data to one client: ', e);
  //       }
  //       console.log('Next data was sent to one client: ', dataToSend);
  //     });
  //   });
  // }

  sendToOne(websocket, dataToSend) {
    // TODO: check if websocket open ?
    websocket.send(JSON.stringify(dataToSend), (e) => {
      if (e) {
        console.log('Failed to send data to one client: ', e);
      }
      console.log('Next data was sent to one client: ', dataToSend);
    });
  }

  // send to everyone else
  broadcast(websocket, outgoing) {
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

  // has cancel method
  throttledBroadcast(websocket, outgoing) {
    return throttle(
      this.broadcast,
      THROTTLE_WAIT,
      { leading: true, trailing: false }
    )(
      websocket,
      outgoing
    );
  }

  resendMessageToAll(websocket, incoming) {
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

  sendTypingNotification(websocket, incoming) {
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
