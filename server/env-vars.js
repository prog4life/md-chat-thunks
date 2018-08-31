// to load from different path
// const path = require('path');

// require('dotenv-safe').config()
//   .load({
//     path: path.join(__dirname, '../../.env'),
//     sample: path.join(__dirname, '../../.env.example'),
//   });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
