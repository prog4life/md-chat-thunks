import React from 'react';
import PropTypes from 'prop-types';

const ChatMessage = ({ nickname, text, isOwn }) => (
  <div className="chat-history-msg">
    <span className={isOwn ? 'myself' : 'author'}>
      {isOwn ? 'Me: ' : `${nickname}: `}
    </span>
    <span>
      {text}
    </span>
  </div>
);

ChatMessage.propTypes = {
  isOwn: PropTypes.bool,
  nickname: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

ChatMessage.defaultProps = {
  isOwn: false
};

export default ChatMessage;
