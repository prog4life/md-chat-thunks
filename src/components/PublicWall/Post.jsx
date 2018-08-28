import React, { Fragment } from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';

const Post = ({
  id, author, createdAt, nickname, text, uid, hasTempId, onDelete,
}) => (
  <Fragment>
    {/* {`List Item ${index + 1}`} */}
    <div style={{ backgroundColor: '#fdececa3' }}>
      {`Author: ${nickname}`}
    </div>
    <div style={{ backgroundColor: '#fffdfd' }}>
      {text}
    </div>
    <div style={{ backgroundColor: 'lemonchifon' }}>
      {`Created at: ${(new Date(createdAt)).toLocaleString('en-GB')}`}
    </div>
    {' '}
    <Link to={`/chats/${author}`}>
      {'Chat'}
    </Link>
    {uid === author && !hasTempId && (
      <span
        onClick={onDelete(id)}
        role="button"
        tabIndex="0"
        style={{ cursor: 'pointer', margin: '0 5px', color: 'lightred' }}
        onKeyPress={() => {}}
      >
        {'Delete'}
      </span>
    )}
  </Fragment>
);

Post.propTypes = {
  author: PT.string.isRequired,
  createdAt: PT.number.isRequired,
  hasTempId: PT.bool,
  id: PT.string.isRequired,
  nickname: PT.string.isRequired,
  onDelete: PT.func.isRequired,
  text: PT.string.isRequired,
  uid: PT.string,
};

Post.defaultProps = {
  hasTempId: false,
  uid: null,
};

export default Post;
