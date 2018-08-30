const mongoose = require('mongoose');
const { log } = require('../loggers')(module);
const User = require('./user-model');

const { Schema } = mongoose;

const anonymousUserSchema = Schema({
  login: {
    // type: String,
    unique: false,
    required: false,
  },
  password: {
    type: String,
    required: false,
    minlength: 4, // TODO: change to 6-8
    maxlength: 128,
  },
});

module.exports = User.discriminator('AnonymousUser', anonymousUserSchema);
