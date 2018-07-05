const mongoose = require('mongoose');
const { logger } = require('../loggers');

const { Schema } = mongoose;

const userSchema = Schema({
  // subscribers: {
  //   type: [Schema.Types.ObjectId], // String, Array,
  //   required: true,
  // },
  login: { type: String },
  subscribedToWall: { type: Schema.Types.ObjectId, ref: 'Wall' },
});

// user._someId = new mongoose.Types.ObjectId;

userSchema.statics.createOne = function createOne(userData = {}) {
  return this.create(userData)
    .then((user) => {
      logger.debug('new user created: ', JSON.stringify(user, null, 4));

      this.count({}, (e, count) => {
        if (e) return logger.error(e);
        return logger.debug('current user count: ', count);
      });

      return user;
    })
    .catch(err => logger.error('User creation error ', err));
};

userSchema.statics.deleteAll = function deleteAll(callback = () => {}) {
  this.deleteMany({}, (err) => {
    if (err) {
      logger.error(err);
      callback(err);
    }
    logger.debug('All users deleted');
    return callback();
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
