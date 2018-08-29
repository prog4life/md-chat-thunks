const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// (monogdb uri, options, callback) => Promise
mongoose.connect('mongodb://localhost:27017/md-chat', {
  // (node:5272) DeprecationWarning: current URL string parser is deprecated,
  // and will be removed in a future version. To use the new parser, pass
  // option { useNewUrlParser: true } to MongoClient.connect.
  useNewUrlParser: true,
  keepAlive: 1,
});
// .then(
//   () => console.log('MongoDB connection is open'),
//   err => console.error('MongoDB connection error ', err),
// );

// Exit application on error
// mongoose.connection.on('error', (err) => {
//   console.error(`MongoDB connection error: ${err}`);
//   process.exit(-1);
// });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => console.log('MongoDB connection is open'));

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useMongoClient: true,
  });
  return mongoose.connection;
};
exports.mongoose = mongoose;
