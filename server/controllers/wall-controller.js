const { Wall } = require('../models/wall-model');
const { logger } = require('../loggers');

/**
 * Find wall by city, add user id(s) to wall subscibers, return array
 * with updated wall
 * @param {String[] | String} userIds - id(s) of connected user(s)
 * @param {String} city - name of city wall belongs to
 * @returns {Array[Error] | Array[null, Object]}
 * @public
 */
exports.addSubscribers = async (userIds, city) => {
  try {
    const wall = await Wall.subscribe(userIds, city); // updated wall
    return [null, wall]; // NOTE: maybe need toJSON() ???
  } catch (err) {
    return [err];
  }
};
