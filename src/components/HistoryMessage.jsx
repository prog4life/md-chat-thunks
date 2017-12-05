import React from 'react';
import PropTypes from 'prop-types';

const HistoryMessage = ({ nickname, text, isOwn }) => (
  <div className="chat-history-msg">
    <span className={isOwn ? 'myself' : 'author'}>
      {isOwn ? 'Me: ' : `${nickname}: `}
    </span>
    <span>
      {text}
    </span>
  </div>
);

HistoryMessage.propTypes = {
  isOwn: PropTypes.bool,
  nickname: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

HistoryMessage.defaultProps = {
  isOwn: false
};

export default HistoryMessage;
