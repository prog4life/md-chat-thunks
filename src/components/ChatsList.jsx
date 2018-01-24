import React from 'react';
import ChatsListItem from './ChatsListItem';

const ChatsList = ({ onItemClick }) => (
  <section className="chats-list chats-list_paper">
    <ChatsListItem onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatsListItem onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatsListItem onItemClick={onItemClick} />
  </section>
);

export default ChatsList;
