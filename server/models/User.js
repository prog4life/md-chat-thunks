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
      logger.debug('New user created: ', JSON.stringify(user, null, 4));

      this.find({}, (e, users) => {
        if (e) return logger.error(e);
        const userIds = users.map(u => u.id);
        return logger.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु : ', userIds.join(', '));
      });

      return user;
    })
    .catch(err => logger.error('User creation error ', err));
};

userSchema.statics.deleteOneById = function deleteOneById(id) {
  return this.deleteOne({ _id: id }).exec()
    .then(res => logger.debug(`User with id ${id} deleted, response: `, res))
    .catch(e => logger.error(`Failed to delete user with id ${id} `, e));
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
