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


wallSchema.methods.subscribe = function subscribe(clientId, callback) {
  this.model('Wall').update( // TODO: replace by document.update()
    { _id: this.id },
    { $push: { subscribers: clientId } },
    (err, rawRes) => {
      if (err) return logger.error('Fail to add to wall subscribers: ', err);
      logger.debug('Updated subscribers length: ', this.subscribers.length);
      logger.debug(
        'Updated subscribers truthy length: ',
        this.subscribers.filter(Boolean).length,
      );
      // TODO: replace by promise later
      callback();
      return logger.debug(`Add ${clientId} to wall subscribers, response: `, rawRes);
    },
  );
};

wallSchema.methods.unsubscribe = function subscribe(clientId) {
  this.model('Wall').update( // TODO: replace by document.update()
    { _id: this.id },
    { $pull: { subscribers: clientId } },
    (err, rawRes) => {
      if (err) return logger.error('Fail to del wall subscriber: ', err);
      return logger.debug(`Delete subscriber ${clientId}, response: `, rawRes);
    },
  );
};


// wallSchema.statics.subscribe = function subscribe(clientId) {
//   this.update(
//     { _id: this.id },
//     { $push: { subscribers: clientId } },
//     (err, rawRes) => {
//       if (err) return logger.error('Fail to add to wall subscribers: ', err);
//       logger.debug('Updated subscribers length: ', this.subscribers.length);
//       logger.debug(
//         'Updated subscribers truthy length: ',
//         this.subscribers.filter(Boolean).length,
//       );
//       return logger.debug(`Add ${clientId} to wall subscribers, response: `, rawRes);
//     },
//   );
// };

// wallSchema.statics.unsubscribe = function subscribe(clientId) {
//   this.update(
//     { _id: this.id },
//     { $pull: { subscribers: clientId } },
//     (err, rawRes) => {
//       if (err) return logger.error('Fail to del wall subscriber: ', err);
//       return logger.debug(`Delete subscriber ${clientId}, response: `, rawRes);
//     },
//   );
// };

wallSchema.statics.createOne = function createOne(params) {
  return this.create(params)
    .then((wall) => {
      logger.debug('New wall saved: ', JSON.stringify(wall, null, 4));

      this.count({}, (e, count) => {
        if (e) return logger.error(e);
        return logger.debug('Current wall count: ', count);
      });

      return wall;
    })
    .catch(err => logger.error('Wall creation error ', err));
};

wallSchema.statics.findSingle = function findSingle() {
  return this.findOne().exec()
    .then((wall) => {
      logger.debug('Found main wall with id: ', wall.id);

      return wall;
    })
    .catch(err => logger.error('Failed to find main wall ', err));
};

wallSchema.statics.deleteAll = function deleteAll(callback = () => {}) {
  this.deleteMany({}, (err) => {
    if (err) {
      logger.error(err);
      callback(err);
    }
    logger.debug('All walls deleted');
    return callback();
  });
};

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

const Wall = mongoose.model('Wall', wallSchema);

module.exports = Wall;
