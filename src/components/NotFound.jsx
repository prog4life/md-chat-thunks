import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = props => (
  <div className="not-found" >
    {'404 Page content. Go to '}
    <Link to="/">
      {'Chats'}
    </Link>
    {' '}
    <Link to="/profile">
      {'Profile'}
    </Link>
    {' '}
    <Link to="/settings">
      {'Settings'}
    </Link>
  </div>
);

export default NotFound;
