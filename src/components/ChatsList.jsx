import React, { Fragment } from 'react';
import ChatsListItem from './ChatsListItem';

const ChatsList = ({ chats, onItemClick }) => (
  <section className="chats-list chats-list_paper">
    {chats.map((chat, index) => (
      <Fragment key={chat.id}>
        <ChatsListItem chat={chat} onItemClick={onItemClick} />
        {index !== chats.length - 1 && <hr className="chats-list__delimiter" />}
      </Fragment>
    ))}
    {/* <ChatsListItem onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatsListItem onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatsListItem onItemClick={onItemClick} /> */}
  </section>
);

export default ChatsList;
