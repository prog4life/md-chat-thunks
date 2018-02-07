import React from 'react';

import avatarSrc from 'assets/test-avatar.jpg';

const Avatar = () => (
  <div className="chat-preview__avatar avatar">
    <img
      className="avatar__img_small"
      src={avatarSrc}
      alt="participant avatar"
    />
  </div>
);

export default Avatar;
