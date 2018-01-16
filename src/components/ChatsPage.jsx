import React from 'react';
import ChatsListItem from './ChatsListItem';

const ChatsPage = props => (
  <div className="chats-page">
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
  </div>
);

export default ChatsPage;
