const shortId = require('shortid');

const id = () => shortId.generate();

exports.getTempPosts = () => (
  [
    { id: id(), authorId: id(), nickname: 'Buddy', createdAt: 1441242114 },
    { id: id(), authorId: id(), nickname: 'Bucky', createdAt: 23535324414 },
    { id: id(), authorId: id(), nickname: 'Fluffy', createdAt: 9099931913 },
  ]
);
