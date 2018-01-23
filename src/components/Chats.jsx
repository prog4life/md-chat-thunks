import React from 'react';
import ChatsList from './ChatsList';

const Chats = props => (
  <div className="chats">
    <div className="container">
      {/* <h3 className="chat__header">
        {'Chats Page'}
      </h3> */}
      <ChatsList />
    </div>
    <div className="test-picture" />
  </div>
);

export default Chats;
