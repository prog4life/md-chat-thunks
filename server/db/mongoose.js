const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// (monogdb uri, options, callback) => Promise
mongoose.connect('mongodb://localhost:27017/md-chat', {
  // (node:5272) DeprecationWarning: current URL string parser is deprecated,
  // and will be removed in a future version. To use the new parser, pass
  // option { useNewUrlParser: true } to MongoClient.connect.
  useNewUrlParser: true,
}).then(
  () => console.log('Connection is open'),
  err => console.error.bind(console, 'Connection error: ', err),
);

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', () => console.log('Connection is open'));

exports.mongoose = mongoose;
