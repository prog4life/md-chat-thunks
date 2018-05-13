const db = require('./database');

// TODO: clean wall subscribers on websocket server start

const subscribe = (userId) => {
  console.log(`Connected ${userId} to wall`);

  const subscribers = db.get('wall.subscribers')
    // .union([userId]) // alternatively:
    .concat(userId)
    .uniq()
    .value();

  db.set('wall.subscribers', subscribers).write();

  console.log('after subscribe ', db.get('wall.subscribers').value());
};

const unsubscribe = (userId) => {
  console.log(`Disconnected ${userId} from wall`);

  db.get('wall.subscribers')
    .pull(userId)
    // .remove(userId) // requires predicate
    .write();

  console.log('after unsubscribe ', db.get('wall.subscribers').value());
};

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
