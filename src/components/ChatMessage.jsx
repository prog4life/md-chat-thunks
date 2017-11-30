import React from 'react';
import PropTypes from 'prop-types';

const ChatMessage = ({nickname, text}) => {
  return (
    <div className="chat-history-msg">
      <span className={nickname === 'Me' ? 'myself' : 'author'}>
        {nickname}:{' '}
      </span>
      <span>
        {text}
      </span>
    </div>
  );
};

export default ChatMessage;

ChatMessage.propTypes = {
  nickname: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
