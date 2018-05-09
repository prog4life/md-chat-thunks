import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';

import AppLogo from './AppLogo';

class AppBar extends React.Component {
  render() {
    return (
      // <Navbar dark color="">
      <Navbar>
        <NavbarBrand href="/">
          <AppLogo />
        </NavbarBrand>
      </Navbar>
    );
  }
}

export default AppBar;
