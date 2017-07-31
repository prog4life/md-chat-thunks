import React from 'react';

const ChatHistory = (props) => {
  return (
    <div className="chat-history">
      {props.children}
    </div>
  );
};

export default ChatHistory;
