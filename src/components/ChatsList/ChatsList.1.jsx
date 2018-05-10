import React, { Fragment } from 'react';

import ChatPreview from './ChatPreview';

const ChatsList = ({ chats, onItemClick, onClose }) => (
  // TODO: stop using shared css classes
  <section className="chats-list paper">
    {chats.map((chat, index) => (
      // TODO: resolve key, chatId can be not unique temporarily !!!
      <Fragment key={chat.chatId}>
        <ChatPreview
          chat={chat}
          onClose={onClose}
          onItemClick={onItemClick}
        />
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
