import React from 'react';
import PropTypes from 'prop-types';

const HistoryMessage = ({ nickname, text, isOwn, status }) => (
  <div className={`history-msg ${isOwn && 'history-msg_own'}`}>
    {/* <span className={isOwn
      ? 'history-msg__own-nickname'
      : 'history-msg__nickname'
    }
    >
      {isOwn ? 'Me: ' : `${nickname}: `}
    </span> */}
    <span>
      {text}
    </span>
    {/* TEMP: isOwn */}
    {
      status && isOwn &&
      <div className="history-msg__status">
        {status.toUpperCase()}
      </div>
    }
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
  status: null
};

export default HistoryMessage;
