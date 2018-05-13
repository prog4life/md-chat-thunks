import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signIn } from 'actions';

import AppBar from './AppBar';

const LoginPage = ({ signIn: signInOnSubmit }) => (
  <Fragment>
    <AppBar />
    <form onSubmit={(event) => {
        event.preventDefault();
        signInOnSubmit(event.target.login.value);
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

export default connect(null, { signIn })(LoginPage);
