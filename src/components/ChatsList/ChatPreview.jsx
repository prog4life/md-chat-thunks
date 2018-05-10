import React from 'react';
import { Badge } from 'reactstrap';

import Avatar from 'components/Avatar';

const CloseXButton = () => (
  <button
    type="button"
    className="close-x-button close"
    aria-label="Close"
  >
    <span aria-hidden="true">
      {'\u00D7'}
      {/* {'\u2573'} - LARGE X */}
    </span>
  </button>
);

const LastMessagePreview = () => (
  <span
    className="last-message-preview text-nowrap d-inline-block text-truncate"
  >
    {'Typing typing typing, adding more contents, nanananana, common be wide - adding more contents, nanananana, common be wide'}
  </span>
);

const LastMessageDate = () => (
  <time className="chat-info__time">
    {/* render consitionally <date> or <time> */}
    {'16 Jan'}
  </time>
);

const ChatPreviewHeader = () => (
  <header
    className="chat-preview__header text-nowrap d-inline-block text-truncate"
  >
    {'Hot Chick'}
    {' '}
    <Badge color="danger" pill>
      {'4'}
    </Badge>
  </header>
);

const ChatPreview = ({ chat, onItemClick, onClose }) => (
  <div
    className="chat-preview d-flex"
    onClick={e => onItemClick(e, chat.chatId)}
    onKeyPress={e => e.key === 'Enter' && onItemClick(e, chat.chatId)}
    role="link"
    tabIndex={0}
  >
    <Avatar />
    {/* TODO: info --> details/additional */}
    <div
      className="chat-preview__details d-flex flex-column justify-content-between"
    >
      <div className="chat-preview__main d-flex justify-content-between">
        <ChatPreviewHeader />
        <CloseXButton />
      </div>
      <div className="chat-preview__additional d-flex">
        <LastMessagePreview />
        <LastMessageDate />
      </div>
    </div>
  </div>
);

export default ChatPreview;
