import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import appLogo from 'assets/test-svg-apptentive.svg';
import Drawer from './Drawer';


class AppBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDrawerOpened: false
    };
  }
  render() {
    return (
      <header className="app-bar">
        <div className="app-bar__toolbar app-bar__toolbar_left">
          <button
            className="app-bar__hamburger icon-button"
            onClick={() => {
              this.setState({ isDrawerOpened: true });
            }}
            type="button"
          >
            {'MENU'}
          </button>
        </div>
        <div className="app-bar__logo-wrapper">
          {/* TODO: replace by NavLink/Link */}
          <Link className="app-bar__logo-link" to="/" >
            <img className="app-bar__logo" src={appLogo} alt="app-logo" />
          </Link>
          <h1>{'Local Wall'}</h1>
        </div>
        <Drawer
          isOpened={this.state.isDrawerOpened}
          onClose={() => (
            this.setState({ isDrawerOpened: false })
          )}
        />
        <div className="app-bar__toolbar app-bar__toolbar_right">
          <button
            className="app-bar__auth-button icon-button"
            type="button"
          >
            {'SIGN IN'}
          </button>
          <button
            className="app-bar__options-button icon-button"
            type="button"
          >
            {'OPTIONS'}
          </button>
        </div>
      </header>
    );
  }
}

export default AppBar;
