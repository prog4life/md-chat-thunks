import React from 'react';

const ChatMessage = ({nickname, text}) => {
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
        {text}
      </span>
    </div>
  );
};

export default ChatMessage;
