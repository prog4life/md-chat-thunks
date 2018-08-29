import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signIn, maybeLogin as login } from 'state/auth';

import AppBar from './AppBar';

const LoginPage = ({ signIn: signInOnSubmit, maybeLogin }) => (
  <Fragment>
    <AppBar />
    <form onSubmit={(event) => {
      event.preventDefault();
      // signInOnSubmit(event.target.login.value);
      maybeLogin();
    }}
    >
      <input name="login" type="text" placeholder="Write your login" />
      <input type="submit" value="Login" />
      {/* <button type="submit">
        {'Login'}
      </button> */}
    </form>
  </Fragment>
);

LoginPage.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default connect(null, {
  signIn,
  maybeLogin: login,
})(LoginPage);
