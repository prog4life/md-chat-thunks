import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import appLogo from 'assets/consul.svg';
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
        <div className="app-bar__logo logo">
          {/* TODO: replace by NavLink/Link */}
          <Link className="logo__link" to="/" >
            <img className="logo__img" src={appLogo} alt="app-logo" />
          </Link>
          <h1 className="logo__text">{'LOCAL CHAT'}</h1>
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
