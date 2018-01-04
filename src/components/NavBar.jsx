import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const propTypes = {
  isOpened: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

const defaultProps = {
  isOpened: false
};

const NavBar = ({ isOpened, onClose }) => {
  return (
    <nav className={isOpened ? 'navbar navbar_opened' : 'navbar navbar_closed'}>
      <div className="navbar__header">
        <button
          className="icon-button navbar__close-sidenav"
          onClick={onClose}
          type="button"
        >
          {'CLOSE'}
        </button>
      </div>
      <ul className="navbar__list">
        <li>
          <NavLink activeClassName="navbar__navlink_active" exact to="/">
            {'Wall'}
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="navbar__navlink_active" to="/map">
            {'Map'}
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="navbar__navlink_active" to="/chats">
            {'Chats'}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

export default NavBar;
