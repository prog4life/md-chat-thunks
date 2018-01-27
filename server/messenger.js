const Chat = require('./chat');
const Messenger = require('./messenger');

// TODO: chats must be stored in Chat module, near his model
const chats = {
  chat1: {
    participants: []
  },
  chat2: {
    participants: []
  }
}; 
// TODO: clients must be stored in Chat module, near his model
const clients = {
  wadwad: {
    websocket,
    chats: ['chatid1', 'chatid2']
  },
  awd234: {
    websocket,
    chats: ['chatid1', 'chatid2']
  }
};

function handleIncoming() {
  type "GetID":
    const newClient = {
      websocket,
      chats: []
    };
    const newId = assignId(); // OR Client.assignId() OR new Client() => new id
    addClient[newId] = newClient;

    if (wss.clients.size > 1) { // 
      wss.clients.forEach((client) => {
        if (client !== websocket) {
          const chat = Chat.create(websocket, client);
          messenger.addChat(chat);
          newClient.chats.push(chat);
        }
      });
    }
}

function assignId() {

}

function addChat() {
}

function removeChat() {

}

function addClient() {

}

function removeClient() {

}