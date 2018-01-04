import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = props => (
  <div>
    {'404 Page content. Return to '}
    <Link to="/">
      {'Home Page'}
    </Link>
  </div>
);

export default NotFoundPage;
