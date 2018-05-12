const shortId = require('shortid');
const db = require('./database');

// const users = {
//   '3c12e3w3': {
//     id: '3c12e3w3',
//     login: 'fluffy',
//     nickname: 'fluffy',
//   },
//   '5oc435bkk': {
//     id: '5oc435bkk',
//     login: 'chappi',
//     nickname: 'chappi',
//   },
// };

class User {
  constructor(newId, login, nickname = null, chats = []) {
    this.id = newId;
    this.login = login;
    this.nickname = nickname;
    this.chats = chats;
  }
}

const signUp = (login) => {
  const newUserId = shortId.generate();
  // const newUser = new User(newUserId, login);
  //
  // users[newUserId] = newUser;

  db.get('users')
    .set(newUserId, { id: newUserId, login, nickname: login })
    .write();

  const newUser = db.get('users')
    .find({ id: newUserId })
    .value();

  console.log('new user ', newUser);

  return newUser;
};

const signIn = (login) => {
  const existing = db.get('users')
    .find({ login })
    .value();

  // const existing = Object.values(users).find(user => user.login === login);
  console.log('existing ', existing);

  return existing || null;
};

exports.signUp = signUp;
exports.signIn = signIn;
