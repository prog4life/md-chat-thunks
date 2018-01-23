import React from 'react';
import { Link } from 'react-router-dom';

const Settings = props => (
  <div className="profile">
    {'Settings Page. Return to '}
    <Link to="/">
      {'Chats'}
    </Link>
    {' '}
    <Link to="/profile">
      {'Profile'}
    </Link>
  </div>
);

export default Settings;
