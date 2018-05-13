const db = require('./database');

// TODO: clean wall subscribers on websocket server start

const subscribe = (userId) => {
  db.get('wall.subscribers')
    // .subscribers
    .push(userId) // TODO: must add only if unique
    .write();

  console.log('after subscribe ', db.getState());
};

const unsubscribe = (userId) => {
  return true;
};

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
