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
          className="sidenav-button app-bar__open-sidenav"
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
      </header>
    );
  };
};

export default AppBar;
