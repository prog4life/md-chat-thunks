import React from 'react';

const ChatsListItem = props => (
  <div className="chat-list__item">
    {/* TODO: Extract Avatar as separate component */}
    {/* <div className="chat-list__item-wrapper"> */}
      <div className="avatar-wrapper">
        <img
          className="avatar_small"
          src="assets/test-avatar.jpg"
          alt="participants avatar"
          title="avatar"
        />
      </div>
      <section className="chat-list__item-info">
        <header>
          {'Interlocutors Name'}
        </header>
        <summary className="item-info__summary">
          <p>
            {'Last message short preview'}
          </p>
          <p>
            <time>
              {'16 Jan 17:24'}
            </time>
          </p>
        </summary>
      </section>
    {/* </div> */}
  </div>
);

export default ChatsListItem;
