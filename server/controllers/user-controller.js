const User = require('../models/user-model');
const Wall = require('../models/wall-model');
const { logger } = require('../loggers')(module);

// TODO: consider to create additional AnonymousUser model
/**
 * Create new user with anonymous flag
 * @returns {Array[Error] | Array[null, Object]}
 * @public
 */
exports.createAnon = async () => {
  try {
    const user = new User({ isAnon: true });
    const savedUser = await user.save();

    logger.debug('New user created: ', JSON.stringify(savedUser, null, 2));

    /* TEMP: start */
    Wall.find({}, (e, users) => {
      if (e) return logger.error(e);
      const userIds = users.map(u => u.id);
      return logger.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु ids: ', userIds.join(', '));
    });
    /* TEMP: end */

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
