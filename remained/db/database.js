// object that simulates database
const db = {
  chat: {
    users: [
      {
        id: 'es2376fse7r',
        name: 'Tester of chat'
      },
      {
        id: '23345yhtd4',
        name: 'Chat user'
      }
    ],
    messages: [
      {
        author: 'es2376fse7r', // user id
        text: 'Message text'
      },
      {
        author: '23345yhtd4', // user id
        text: 'Another message text'
      }
    ]
  }
};

module.exports = db;
