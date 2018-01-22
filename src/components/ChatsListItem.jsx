import React from 'react';

import avatarSrc from 'assets/test-avatar.jpg';

const ChatsListItem = props => (
  <div className="chats-list__item">
    {/* TODO: Extract Avatar as separate component */}
    {/* <div className="chats-list__item-wrapper"> */}
      <div className="avatar-wrapper">
        <img
          className="avatar_small"
          src={avatarSrc}
          alt="participants avatar"
        />
      </div>
      <section className="chats-list__item-info">
        <div className="item-info__preview">
          <header>
            <h4 className="item-info__name">
              {'Hot Chick'}
            </h4>
          </header>
          <p className="item-info__last-message">
            {'Last message short preview, but message itself is really longLast message short preview, but message itself is really longLast message short preview, but message itself is really longLast message short preview, but message itself is really longLast message short preview, but message itself is really longLast message short preview, but message itself is really long'}
          </p>
        </div>
        <summary className="item-info__summary">
          <p className="item-info__unread-count">{'4'}</p>
          <p>
            <time>
              {'16 Jan'}
            </time>
          </p>
        </summary>
      </section>
    {/* </div> */}
  </div>
);

export default ChatsListItem;
