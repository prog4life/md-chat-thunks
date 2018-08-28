const mongoose = require('mongoose');
const { logger } = require('../loggers');

const { Schema } = mongoose;

const userSchema = Schema({
  // subscribers: {
  //   type: [Schema.Types.ObjectId], // String, Array,
  //   required: true,
  // },
  login: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: false, // NOTE: was true
    unique: true,
    trim: true,
    lowercase: true,
    // set to true if have two possible unique keys that are optional, like
    // email and phone number
    // sparse: true,
  },
  password: {
    type: String,
    required: false, // NOTE: was true
    minlength: 4, // TODO: change to 6-8
    maxlength: 128,
  },
  isAnon: {
    type: Boolean,
    required: false,
    // default: true, // for now will be disabled to test when { isAnon: true } passed
  },
  subscribedToWall: { type: Schema.Types.ObjectId, ref: 'Wall' },
}, { timestamps: true });

// user._someId = new mongoose.Types.ObjectId;

userSchema.statics.createOne = function createOne(userData = {}) {
  return this.create(userData)
    .then((user) => {
      logger.debug('New user created: ', JSON.stringify(user, null, 2));

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

userSchema.methods.transform = () => {
  const transformed = {};
  // const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];
  const fields = ['id', 'subscribedToWall', 'createdAt'];

  fields.forEach((field) => {
    transformed[field] = this[field];
  });

  return transformed;
};

// TODO: rename later to toJSON | makeJSON | transfor
userSchema.methods.toWeb = () => {
  const json = this.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  json.id = this._id; // this is for the front end
  return json;
};

module.exports = mongoose.model('User', userSchema);
