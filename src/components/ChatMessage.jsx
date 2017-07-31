import React from 'react';

const ChatMessage = ({nickname, message}) => {
  return (
    <div className="chat-message">
      <span className={(() => {
        if (nickname === 'Me') {
          return 'my-nick';
        }
        return 'author';
      })()}>
        {nickname}:<span> </span>
      </span>
      <span>
        {message}
      </span>
    </div>
  );
};

export default ChatMessage;
