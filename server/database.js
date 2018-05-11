const shortId = require('shortid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

function fillLookupTable(amount = 3) {
  return Array(amount).fill('i').reduce((acc) => {
    const newId = shortId.generate();
    const authorId = shortId.generate();

    acc[newId] = { id: newId, authorId };

    return acc;
  }, {});
}

const posts = fillLookupTable();

db.defaults({
  posts,
  users: {},
  chats: {},
})
  .write();

module.exports = db;
