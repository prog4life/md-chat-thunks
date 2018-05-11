import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {
  Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse,
} from 'reactstrap';

import AppLogo from './AppLogo';

class AppBar extends React.Component {
  state = {
    isOpen: false,
  }
  handleToggling = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }
  render() {
    const { isOpen } = this.state;

    return (
      // <Navbar color="light" fixed="top">
      <Navbar light style={{ backgroundColor: '#fdecece3' }} expand="md">
        <NavbarBrand href="/">
          <AppLogo />
        </NavbarBrand>
        <NavbarToggler onClick={this.handleToggling} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" pills navbar>
            <NavItem>
              <NavLink
                to="/"
                exact
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Public Wall'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/chats"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Chats'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/profile"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Profile'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/settings"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Settings'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/login"
                tag={RouterNavLink}
                activeClassName="bg-white"
              >
                {'Login'}
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default AppBar;
