import React, { Fragment } from 'react';
import ChatPreview from 'Chats/ChatPreview';

const ChatsList = ({ chats, onItemClick }) => (
  // TODO: stop using shared css classes
  <section className="chats-list paper">
    {chats.map((chat, index) => (
      <Fragment key={chat.id}>
        <ChatPreview chat={chat} onItemClick={onItemClick} />
        {index !== chats.length - 1 && <hr className="chats-list__delimiter" />}
      </Fragment>
    ))}
    {/* <ChatPreview onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatPreview onItemClick={onItemClick} />
    <hr className="chats-list__delimiter" />
    <ChatPreview onItemClick={onItemClick} /> */}
  </section>
);

export default ChatsList;
