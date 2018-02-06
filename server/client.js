const shortid = require('shortid');

const clients = {
  // wadwad: {
  //   id: 'wadwad',
  //   websocket,
  //   chats: ['chatid1', 'chatid2']
  // },
  // awd234: {
  //   id: 'awd234',
  //   websocket,
  //   chats: ['chatid1', 'chatid2']
  // }
};


class Client {
  constructor(newId, websocket, chats = []) {
    this.id = newId;
    this.websocket = websocket;
    this.chats = chats;
  }
  // addChat(participants) {

  // }
  // deleteChat(participants) {

  // }
}

exports.Client = Client;

exports.addOne = (websocket, chats) => {
  const newClientId = shortid.generate();
  const client = new Client(newClientId, websocket, chats);

  clients[newClientId] = client;
  return client;
};

exports.deleteOne = (clientId) => {
  delete clients[clientId];
};

exports.getClients = () => clients;

exports.clients = clients;
