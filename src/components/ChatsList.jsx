import React from 'react';
import ChatsListItem from './ChatsListItem';

const ChatsList = props => (
  <section className="chats-list">
    <ChatsListItem />
    <hr className="chats-list__delimiter" />
    <ChatsListItem />
    <hr className="chats-list__delimiter" />
    <ChatsListItem />
  </section>
);

export default ChatsList;
