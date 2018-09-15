const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // TODO: switch to bluebird Promise

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'MongoDB connection error: ')); //  !!!
conn.once('open', () => console.log('MongoDB connection is open'));
// Exit application on error
conn.on('error', (err) => {
  // console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

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
  // (monogdb uri, options, callback) => Promise
  mongoose.connect('mongodb://localhost:27017/md-chat', { // TODO: mongo.uri
    // (node:5272) DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser, pass
    // option { useNewUrlParser: true } to MongoClient.connect.
    useNewUrlParser: true,
    keepAlive: true, // was 1
    // useMongoClient: true, // from boilerplate
  });
  // .then(
  //   () => console.log('MongoDB connection is open'),
  //   err => console.error('MongoDB connection error ', err),
  // );
  return mongoose.connection;
};
