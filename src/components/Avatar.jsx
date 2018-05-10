import React from 'react';

import avatarSrc from 'assets/test-avatar.jpg';

const Avatar = () => (
  <div className="avatar">
    <img
      className="avatar__img"
      src={avatarSrc}
      alt="participant avatar"
    />
  </div>
);

export default Avatar;
