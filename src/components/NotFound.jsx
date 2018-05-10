import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = props => (
  <div className="not-found" >
    {'Page Not Found. You can go to: '}
    <Link to="/">
      {'Chats'}
    </Link>
    {' | '}
    <Link to="/profile">
      {'Profile'}
    </Link>
    {' | '}
    <Link to="/settings">
      {'Settings'}
    </Link>
    {' pages'}
  </div>
);

export default NotFound;
