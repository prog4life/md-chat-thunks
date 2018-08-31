const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { addMinutes, format, getTime } = require('date-fns');
const { log } = require('../loggers')(module);
const { jwtSecret, jwtExpInterval } = require('../env-vars');

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
    unique: false, // TEMP: change later
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
  // isAnon: {
  //   type: Boolean,
  //   required: false,
  //   // default: true, // for now will be disabled to test when { isAnon: true } passed
  // },
  subscribedToWall: { type: Schema.Types.ObjectId, ref: 'Wall' },
}, { timestamps: true });

// user._someId = new mongoose.Types.ObjectId;

// OR: userSchema.statics = { methodName() {} };
userSchema.statics.createOne = function createOne(userData = {}) {
  return this.create(userData)
    .then((user) => {
      log.debug('New user created: ', JSON.stringify(user, null, 2));

      this.find({}, (e, users) => {
        if (e) return log.error(e);
        const userIds = users.map(u => u.id);
        return log.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु : ', userIds.join(', '));
      });

      return user;
    })
    .catch(err => log.error('User creation error ', err));
};

userSchema.statics.deleteOneById = function deleteOneById(id) {
  return this.deleteOne({ _id: id }).exec()
    .then(res => log.debug(`User with id ${id} deleted, response: `, res))
    .catch(e => log.error(`Failed to delete user with id ${id} `, e));
};

userSchema.statics.deleteAll = function deleteAll(callback = () => {}) {
  this.deleteMany({}, (err) => {
    if (err) {
      log.error(err);
      callback(err);
    }
    log.debug('All users deleted');
    return callback();
  });
};

// userSchema.methods = Object.assign(userSchema.methods, {
//
// });
// OR:
// userSchema.method({
//   someMethod() {},
// });

userSchema.methods.transform = function transform() {
  const transformed = {};
  // const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];
  const fields = ['id', 'subscribedToWall', 'createdAt'];

  fields.forEach((field) => {
    if (field === 'createdAt' || field === 'updatedAt') {
      transformed[field] = this[field].getTime();
      return;
    }
    transformed[field] = this[field];
  });

  return transformed;
};

// - make a connection with the server,
// - pass email and password into the request body,
// - receive token and save inside browser’s memory - localStorage,
// - redirect user to specific route - Secret,
// - handle errors

userSchema.methods.token = function token() {
  // OR Math.floor(Date.now() / 1000)
  const currTimeInSec = parseInt(format(Date.now(), 'X'), 10);
  const expirationDate = addMinutes(Date.now(), jwtExpInterval);
  // claims, all optional
  const payload = {
    // expiration time, moment at which token becomes expired
    exp: Math.floor(getTime(expirationDate) / 1000), // seconds, Integer
    // only this one added for no options case
    iat: currTimeInSec, // seconds, Integer
    sub: this._id, // eslint-disable-line no-underscore-dangle
  };

  return jwt.sign(payload, jwtSecret, {
    // After what time from now token will be expired
    // Number will be interpreted as seconds,
    // String without time units at the end - as milliseconds
    // expiresIn: jwtExpirationInterval * 60,
  });
};

// TODO: rename later to toJSON | makeJSON | transfor
userSchema.methods.toWeb = function toWeb() {
  const json = this.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  json.id = this._id; // this is for the front end
  return json;
};

module.exports = mongoose.model('User', userSchema);
