import React from 'react';

const ChatInput = (props) => {
  return (
    <div className="chat-input">
      <input className="nickname" type="text" placeholder="Your nickname"/>
      <textarea className="message-text" rows="5" required
        placeholder="Write your message here">
      </textarea>
      <button className="send-button">SEND</button>
    </div>
  );
};

export default ChatInput;
