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

const Drawer = ({ isOpened, onClose }) => (
  <div className={isOpened ? 'drawer drawer_opened' : 'drawer drawer_closed'}>
    <div className="drawer__cover" />
    <div className="drawer__header">
      <button
        className="icon-button drawer__close-btn"
        onClick={onClose}
        type="button"
      >
        {'CLOSE'}
      </button>
    </div>
    {/* TODO: add .navbar later */}
    <nav className="drawer__navbar">
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
  </div>
);

Drawer.propTypes = propTypes;
Drawer.defaultProps = defaultProps;

export default Drawer;
