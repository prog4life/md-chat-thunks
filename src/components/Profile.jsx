import React from 'react';
import { Link } from 'react-router-dom';

const Profile = props => (
  <div className="profile">
    {'Profile Page. Go to '}
    <Link to="/">
      {'Chats'}
    </Link>
    {' '}
    <Link to="/settings">
      {'Settings'}
    </Link>
  </div>
);

export default Profile;
