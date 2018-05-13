const shortId = require('shortid');
const db = require('./database');

// const users = {
//   '3c12e3w3': {
//     id: '3c12e3w3',
//     login: 'fluffy',
//     token: '',
//     nickname: 'fluffy',
//   },
//   '5oc435bkk': {
//     id: '5oc435bkk',
//     login: 'chappi',
//     token: '',
//     nickname: 'chappi',
//   },
// };

// class User {
//   constructor(newId, login, nickname = null, chats = []) {
//     this.id = newId;
//     this.login = login;
//     this.nickname = nickname;
//     this.chats = chats;
//   }
// }

const assignId = () => shortId.generate();

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
  const authData = {};

  if (existing) {
    authData.token = shortId.generate();
    authData.id = existing.id;

    db.get(`users.${existing.id}`)
      .assign({ token: authData.token })
      .write();
  }

  // const existing = Object.values(users).find(user => user.login === login);
  console.log('existing ', existing);
  console.log('authData ', authData);

  return existing ? authData : null;
};

exports.assignId = assignId;
exports.signUp = signUp;
exports.signIn = signIn;
