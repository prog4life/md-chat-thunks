const mongoose = require('mongoose');
const { log } = require('../loggers')(module);

const { Schema } = mongoose;

const wallSchema = Schema({
  // subscribers: {
  //   type: [Schema.Types.ObjectId], // String, Array,
  //   required: true,
  // },
  city: { type: String, unique: true },
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // subscribers: [{ type: String, ref: 'User' }],
});

// Statics
wallSchema.statics.subscribe = async function subscribe(userIds, city) {
  log.debug('wall.model.subscribe params: ', userIds, city);
  const wall = await this.findOne({ city }).exec();
  const subs = wall.subscribers;
  const isMany = Array.isArray(userIds);
  let exists = false;
  // log.debug('wall.model.subscribe exists and subs: ', { exists, subs });

  if (isMany) {
    exists = userIds.some(id => subs.includes(id));
  } else {
    exists = subs.includes(userIds);
  }
  log.debug('wall.model.subscribe exists and subs: ', { exists, subs: subs.length, userIds });
  if (exists) {
    throw new Error('User with such id is present in wall subscribers already');
  }
  wall.subscribers = subs.concat(userIds);
  log.debug('wall.model.subscribe upd subscribers: ', { subs: wall.subscribers.length });
  const updatedWall = await wall.save();
  // TEMP:
  log.debug('Updated subscribers length: ', updatedWall.subscribers.length);
  log.debug(
    'Updated subscribers truthy length: ',
    updatedWall.subscribers.filter(Boolean).length,
  );
  return updatedWall;
};

wallSchema.statics.createOne = function createOne(params) {
  return this.create(params)
    .then((wall) => {
      log.debug('New wall saved: ', JSON.stringify(wall, null, 4));

      this.count({}, (e, count) => {
        if (e) return log.error(e);
        return log.debug('Current wall count: ', count);
      });

      return wall;
    })
    .catch(err => log.error('Wall creation error ', err));
};

wallSchema.statics.findSingle = function findSingle() {
  return this.findOne().exec()
    .then((wall) => {
      log.debug('Found main wall with id: ', wall.id);

      return wall;
    })
    .catch(err => log.error('Failed to find main wall ', err));
};

wallSchema.statics.deleteAll = function deleteAll(callback = () => {}) {
  this.deleteMany({}, (err) => {
    if (err) {
      log.error(err);
      callback(err);
    }
    log.debug('All walls deleted');
    return callback();
  });
};

// Methods
wallSchema.methods.unsubscribe = function subscribe(clientId) {
  this.model('Wall').update( // TODO: replace by document.update()
    { _id: this.id },
    { $pull: { subscribers: clientId } },
    (err, rawRes) => {
      if (err) return log.error('Fail to delete wall subscriber: ', err);
      return log.debug(`Delete subscriber ${clientId}, response: `, rawRes);
    },
  );
};

// wallSchema.statics.subscribe = function subscribe(clientId) {
//   this.update(
//     { _id: this.id },
//     { $push: { subscribers: clientId } }, // NOTE: push
//     (err, rawRes) => {
//       if (err) return log.error('Fail to add to wall subscribers: ', err);
//       log.debug('Updated subscribers length: ', this.subscribers.length);
//       log.debug(
//         'Updated subscribers truthy length: ',
//         this.subscribers.filter(Boolean).length,
//       );
//       return log.debug(`Add ${clientId} to wall subscribers, response: `, rawRes);
//     },
//   );
// };

// wallSchema.statics.unsubscribe = function subscribe(clientId) {
//   this.update(
//     { _id: this.id },
//     { $pull: { subscribers: clientId } }, // NOTE: pull
//     (err, rawRes) => {
//       if (err) return log.error('Fail to del wall subscriber: ', err);
//       return log.debug(`Delete subscriber ${clientId}, response: `, rawRes);
//     },
//   );
// };

// wall.update( // TODO: replace by document.update()
//   { _id: this.id },
//   { $push: { subscribers: clientId } },
//   (err, rawRes) => {
//     if (err) return log.error('Fail to add to wall subscribers: ', err);
//     log.debug('Updated subscribers length: ', this.subscribers.length);
//     log.debug(
//       'Updated subscribers truthy length: ',
//       this.subscribers.filter(Boolean).length,
//     );
//     // TODO: replace by promise later
//     callback();
//     return log.debug(`Add ${clientId} to wall subscribers, response: `, rawRes);
//   },
// );

// 2nd - optional, to select only such prop
// Wall.find({}, 'subscribers', (err, docs) => {
//   if (err) return log.error(err);
//   this.wallId = docs[0].id;
//   return log.debug('Single wall id: ', docs[0].id);
// });
// Wall.find({}, 'subscribers').exec().then(
//   docs => log.debug('doc 1 id: ', docs[0].id),
//   err => log.error(err),
// );

module.exports = mongoose.model('Wall', wallSchema);
