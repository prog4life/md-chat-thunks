import React from 'react';
import PropTypes from 'prop-types';

const HistoryMessage = ({ nickname, text, isOwn, status }) => (
  <div className="chat-history-msg">
    <span className={isOwn ? 'myself' : 'author'}>
      {isOwn ? 'Me: ' : `${nickname}: `}
    </span>
    <span>
      {text}
    </span>
    {status &&
      <div style={{ textAlign: 'right' }}>
        {status.toLowerCase()}
      </div>}
  </div>
);

HistoryMessage.propTypes = {
  isOwn: PropTypes.bool,
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string,
  text: PropTypes.string.isRequired
};

HistoryMessage.defaultProps = {
  isOwn: false,
  status: ''
};

export default HistoryMessage;
