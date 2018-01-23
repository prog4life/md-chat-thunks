import React from 'react';
import ChatsListItem from './ChatsListItem';

const Chats = props => (
  <div className="chats">
    <div className="container">
      {/* <h3 className="chat__header">
        {'Chats Page'}
      </h3> */}
      <div className="chats-list">
        <ChatsListItem />
        <hr className="chats-list__delimeter" />
        <ChatsListItem />
        <hr className="chats-list__delimeter" />
        <ChatsListItem />
      </div>
    </div>
    <div className="test-picture" />
  </div>
);

export default Chats;
