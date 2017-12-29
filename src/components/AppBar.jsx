import React from 'react';
import NavBar from './NavBar';

const AppBar = props => (
  <header className="app-bar">
    <div className="menu-button">{'MENU'}</div>
    <h1>Local Wall</h1>
    <NavBar />
  </header>
);

export default AppBar;
