import React from 'react';
import Avatar from 'components/Avatar';

const ChatPreview = ({ chat, onItemClick, onClose }) => (
  <div
    className="chat-preview"
    onClick={e => onItemClick(e, chat.chatId)}
    onKeyPress={e => e.key === 'Enter' && onItemClick(e, chat.chatId)}
    role="link"
    tabIndex={0}
  >
    {/* TODO: Extract Avatar as separate component */}
    {/* <div className="chat-preview__item-wrapper"> */}
    <Avatar />
    <section className="chat-preview__details chat-info">
      <div className="chat-preview__main">
        <header className="chat-info__name">
          <h4>
            {'Hot Chick'}
          </h4>
        </header>
        <p className="chat-info__unread-count">{'4'}</p>
        <button
          className="chat-preview__close-btn"
          onClick={e => onClose(e, chat.chatId)}
          type="button"
        >
          <span>
            <svg
              className="close-btn__svg"
              focusable="false"
              viewBox="0 0 22.88 22.88"
            >
              <path
                d="M0.324,1.909c-0.429-0.429-0.429-1.143,0-1.587c0.444-0.429,1.143-0.429,1.587,0l9.523,9.539  l9.539-9.539c0.429-0.429,1.143-0.429,1.571,0c0.444,0.444,0.444,1.159,0,1.587l-9.523,9.524l9.523,9.539  c0.444,0.429,0.444,1.143,0,1.587c-0.429,0.429-1.143,0.429-1.571,0l-9.539-9.539l-9.523,9.539c-0.444,0.429-1.143,0.429-1.587,0  c-0.429-0.444-0.429-1.159,0-1.587l9.523-9.539L0.324,1.909z"
                // fill="#fafafa"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="chat-preview__additional">
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
