import React from 'react';
import PropTypes from 'prop-types';

const ChatHistoryMsg = ({ nickname, text, isOwn, status }) => (
  <div className={`chat-history-msg${isOwn ? ' chat-history-msg_own' : ''}`}>
    <span className="chat-history-msg__text">
      {text}
    </span>
    {/* TEMP: isOwn */}
    {
      status && isOwn &&
      <div className="chat-history-msg__status">
        {status.toUpperCase()}
      </div>
    }
  </div>
);

ChatHistoryMsg.propTypes = {
  isOwn: PropTypes.bool,
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string,
  text: PropTypes.string.isRequired
};

ChatHistoryMsg.defaultProps = {
  isOwn: false,
  status: null
};

export default ChatHistoryMsg;
