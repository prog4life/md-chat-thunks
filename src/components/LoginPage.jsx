import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { signIn } from 'actions';

import AppBar from './AppBar';

const LoginPage = ({ signIn }) => (
  <Fragment>
    <AppBar />
    <form onSubmit={(event) => {
        event.preventDefault();
        signIn(event.target.value);
      }}
    >
      <input type="text" placeholder="Write your login" />
      <button type="submit">
        {'Login'}
      </button>
    </form>
  </Fragment>
);

export default connect(null, { signIn })(LoginPage);
