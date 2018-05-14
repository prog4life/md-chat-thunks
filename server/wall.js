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

const isSubscriber = (currentId) => {
  const index = db.get('wall.subscribers')
    .indexOf(currentId)
    .value();

  return index !== -1;
};

const replaceSubscriber = (currentId, newId) => {
  const subscribers = db.get('wall.subscribers').value();
  const index = subscribers.indexOf(currentId);

  if (index !== -1) {
    subscribers[index] = newId;
  }
  db.set('wall.subscribers', subscribers).write();
};

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.isSubscriber = isSubscriber;
exports.replaceSubscriber = replaceSubscriber;
