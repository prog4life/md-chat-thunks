import React, { Component } from 'react';
import NavBar from './NavBar';

class AppBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavBarOpened: false
    };
  }
  render() {
    return (
      <header className="app-bar">
        <button
          className="icon-button app-bar__open-sidenav"
          onClick={() => {
            this.setState({ isNavBarOpened: true });
          }}
          type="button"
        >
          {'MENU'}
        </button>
        <h1>{'Local Wall'}</h1>
        <NavBar
          isOpened={this.state.isNavBarOpened}
          onClose={() => (
            this.setState({ isNavBarOpened: false })
          )}
        />
        <div className="app-bar__toolbar">
          <button
            className="icon-button app-bar__auth-button"
            type="button"
          >
            {'SIGN IN'}
          </button>
          <button
            className="icon-button app-bar__options-button"
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
