import React from 'react';

import appLogo from 'assets/consul.svg';
import textualLogo from 'assets/app-logo.png';

const AppLogo = () => (
  <div className="app-logo">
    <img className="app-logo__img" src={appLogo} alt="app-logo-spinner" />
    <img className="app-logo__textual" src={textualLogo} alt="app-logo-text" />
    {/* <h1 className="app-logo__text">
      {'LOCAL CHAT'}
    </h1> */}
  </div>
);

export default AppLogo;
