import React from 'react';
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
              <NavLink href="/chats">
                {'Chats'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/profile">
                {'Profile'}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/settings">
                {'Settings'}
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default AppBar;
