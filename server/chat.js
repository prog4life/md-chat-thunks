const shortid = require('shortid');

const chats = {
  // chat1: {
  //   id: 'chat1'
  //   participants: ['clientid1', 'clientid2']
  // },
  // chat2: {
  //   id: 'chat2'
  //   participants: []
  // }
};

class Chat {
  constructor(newId, participants) {
    this.id = newId;
    this.participants = participants;
  }
  // addParticipants(participants) {

  // }
  // deleteParticipants(participants) {

  // }
}

exports.Chat = Chat;

exports.addOne = (participants) => {
  const newChatId = shortid.generate();
  const chat = new Chat(newChatId, participants);

  chats[newChatId] = chat;
  return chat;
};

exports.deleteOne = (chatId) => {
  delete chats[chatId];
};

exports.getChats = () => chats;

exports.chats = chats;
