import React from 'react';

const ChatMessage = ({nickname, text}) => {
  return (
    <div className="chat-message">
      <span className={nickname === 'Me' ? 'myself' : 'author'}>
        {nickname}:{'\u00A0'}
      </span>
      <span>
        {text}
      </span>
    </div>
  );
};

export default ChatMessage;
