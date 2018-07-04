const mongoose = require('mongoose');
const { logger } = require('../loggers');

const { Schema } = mongoose;

const wallSchema = Schema({
  // subscribers: {
  //   type: [Schema.Types.ObjectId], // String, Array,
  //   required: true,
  // },
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});


wallSchema.methods.subscribe = function subscribe(clientId) {
  Wall.update(
    { _id: this.id },
    { $push: { subscribers: clientId } },
    (err, rawRes) => {
      if (err) return logger.error('fail to add to wall subscribers: ', err);
      logger.debug('updated subscribers length: ', this.subscribers.filter(Boolean).length);
      logger.debug('updated subscribers null: ', this.subscribers.filter(s => s === null).length);
      return logger.debug('add to wall subscribers response: ', rawRes);
    },
  );
};

wallSchema.methods.unsubscribe = function subscribe(clientId) {
  Wall.update(
    { _id: this.id },
    { $pull: { subscribers: clientId } },
    (err, rawRes) => {
      if (err) return logger.error('fail to del wall subscriber: ', err);
      return logger.debug('del wall subscriber response: ', rawRes);
    },
  );
};

wallSchema.statics.createOne = function createOne(params) {
  return this.create(params)
    .then((wall) => {
      logger.debug('new wall saved: ', JSON.stringify(wall, null, 4));

      this.count({}, (e, count) => {
        if (e) return logger.error(e);
        return logger.debug('current wall count: ', count);
      });

      return wall;
    })
    .catch(err => logger.error('Wall creation error ', err));
};

wallSchema.statics.deleteAll = function deleteAll(callback) {
  this.deleteMany({}, (err) => {
    if (err) {
      logger.error(err);
      callback(err);
    }
    logger.debug('All walls deleted');
    return callback();
  });
};

const Wall = mongoose.model('Wall', wallSchema);
// const commonWall = new Wall({ subscribers: [] });

// commonWall.save().then(
//   (wall) => {
//     logger.debug('new wall saved: ', JSON.stringify(wall, null, 4), wall.id);
//   },
//   err => logger.error('Wall creation error ', err),
// );

// 2nd - optional, to select only such prop
// Wall.find({}, 'subscribers', (err, docs) => {
//   if (err) return logger.error(err);
//   this.wallId = docs[0].id;
//   return logger.debug('Single wall id: ', docs[0].id);
// });
// Wall.find({}, 'subscribers').exec().then(
//   docs => logger.debug('doc 1 id: ', docs[0].id),
//   err => logger.error(err),
// );

exports.Wall = Wall;
