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
  const token = shortId.generate();
  const newUser = { id: newUserId, login, token };
  // const newUser = new User(newUserId, login);
  //
  // users[newUserId] = newUser;

  db.get('users')
    .set(newUserId, newUser)
    .write();

  const createdUser = db.get('users')
    .find({ id: newUserId })
    .value();

  console.log('new user ', createdUser);

  return createdUser;
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
