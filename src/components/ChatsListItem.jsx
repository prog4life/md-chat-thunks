import React from 'react';

import avatarSrc from 'assets/test-avatar.jpg';

const ChatsListItem = ({ chat, onItemClick }) => (
  <div
    className="chats-list__item"
    onClick={e => onItemClick(e, chat.id)}
    onKeyPress={e => e.key === 'Enter' && onItemClick(e, chat.id)}
    role="link"
    tabIndex={0}
  >
    {/* TODO: Extract Avatar as separate component */}
    {/* <div className="chats-list__item-wrapper"> */}
    <div className="avatar-wrapper">
      <img
        className="avatar_small"
        src={avatarSrc}
        alt="participants avatar"
      />
    </div>
    <section className="chats-list__chat-info">
      <div className="chat-info__main">
        <header className="chat-info__name">
          <h4>
            {'Hot Chick'}
          </h4>
        </header>
        <p className="chat-info__unread-count">{'4'}</p>
      </div>
      <div className="chat-info__additional">
        <p className="chat-info__last-message">
          {'Last '}
        </p>
        {/* <p> */}
        {/* render consitionally <date> or <time> */}
        <time className="chat-info__time">
          {'16 Jan'}
        </time>
        {/* </p> */}
      </div>
    </section>
    {/* </div> */}
  </div>
);

export default ChatsListItem;
