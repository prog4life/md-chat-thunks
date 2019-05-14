const User = require('../models/user-model');
const AnonymousUser = require('../models/anon-user-model');
const Wall = require('../models/wall-model');
const { log } = require('../loggers')(module);

// TODO: consider to create additional AnonymousUser model
/**
 * Create new user with anonymous flag
 * @returns {Array[Error] | Array[null, Object]}
 * @public
 */
exports.createAnon = async () => {
  try {
    const user = new AnonymousUser();
    const savedUser = await user.save();

    log.debug('New user created: ', JSON.stringify(savedUser, null, 2));

    /* TEMP: start */
    Wall.find({}, (e, users) => {
      if (e) return log.error(e);
      const userIds = users.map(u => u.id);
      return log.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु ids: ', userIds.join(', '));
    });
    /* TEMP: end */
    const transformed = savedUser.transform();
    log.debug('New user transformed: ', transformed);

    return [null, transformed];
  } catch (error) {
    log.error('User creation error ', error);
    return [error];
  }
};

exports.deleteAnonUserById = async (userId) => {
  try {
    AnonymousUser.deleteOneById(userId);
    log.debug('Anonymous user with id %s deleted: ', userId);

    /* TEMP: start */
    Wall.find({}, (e, users) => {
      if (e) return log.error(e);
      const userIds = users.map(u => u.id);
      return log.debug('Current ⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु ids: ', userIds.join(', '));
    });
    /* TEMP: end */

    return [null, userId];
  } catch (error) {
    log.error('User deletion error ', error);
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
