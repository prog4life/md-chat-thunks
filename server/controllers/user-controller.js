const { User } = require('../models/user-model');
const { logger } = require('../loggers');

// TODO: consider to create assitional AnonymousUser model
exports.createAnon = async () => {
  try {
    const user = new User({ isAnon: true });
    const savedUser = await user.save();

    logger.debug('New user created: ', JSON.stringify(savedUser, null, 2));

    // TEMP:
    this.find({}, (e, users) => {
      if (e) return logger.error(e);
      const userIds = users.map(u => u.id);
      return logger.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु : ', userIds.join(', '));
    });

    return [null, savedUser.transform()];
  } catch (error) {
    logger.error('User creation error ', error);
    return [error];
  }
};

// exports.create = async (req, res, next) => {
//   let userData;
//   // anonymous user is connected to socket.io server
//   if (!req || !req.body) {
//     userData = { isAnonymous }
//   }
//   try {
//     const user = new User(req.body);
//     const savedUser = await user.save();
//     res.status(httpStatus.CREATED);
//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// }
