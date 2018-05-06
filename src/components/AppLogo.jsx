import React from 'react';

import appLogo from 'assets/consul.svg';

const AppLogo = () => (
  <div className="app-logo">
    <img className="app-logo__img" src={appLogo} alt="app-logo" />
    <h1 className="app-logo__text">
      {'LOCAL CHAT'}
    </h1>
  </div>
);

export default AppLogo;
