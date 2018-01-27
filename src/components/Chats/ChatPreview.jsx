import React from 'react';

import avatarSrc from 'assets/test-avatar.jpg';

const ChatPreview = ({ chat, onItemClick }) => (
  <div
    className="chat-preview"
    onClick={e => onItemClick(e, chat.chatId)}
    onKeyPress={e => e.key === 'Enter' && onItemClick(e, chat.chatId)}
    role="link"
    tabIndex={0}
  >
    {/* TODO: Extract Avatar as separate component */}
    {/* <div className="chat-preview__item-wrapper"> */}
    <div className="chat-preview__avatar avatar">
      <img
        className="avatar__img_small"
        src={avatarSrc}
        alt="participant avatar"
      />
    </div>
    <section className="chat-preview__info chat-info">
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
          {'Typing typing typing, adding more contents, nanananana, common be wide - adding more contents, nanananana, common be wide'}
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

export default ChatPreview;
