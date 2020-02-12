import React, { useState, useContext } from 'react';

import { WalletContext } from 'contexts/WalletContext';

import Header from './containers/Header';
import HoverOver from './components/HoverOver';
import Main from './containers/Main';
import OnBoarding from './containers/OnBoarding';

import styles from './app.module.scss';

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const { wallet, tokens, balances, logout } = useContext(WalletContext);
  console.log('balances', balances);
  console.log('tokesn', tokens);

  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleLogout = () => {
    toggleShowInfo();
    logout();
  };

  return (
    <div className={styles.app}>
      <Header isLoggedIn={!!wallet} onToggle={toggleShowInfo} />

      {wallet ? <Main /> : <OnBoarding showInfo={showInfo} onToggle={toggleShowInfo} />}

      <HoverOver
        isLoggedIn={!!wallet}
        showInfo={showInfo}
        onToggle={toggleShowInfo}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
