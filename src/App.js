import React, { useState } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import OnBoarding from './components/OnBoarding';
import styles from './app.module.scss';

function App() {
  const [isLoggedIn] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className={styles.app}>
      <Header isLoggedIn={isLoggedIn} onToggle={toggleShowInfo} />

      {isLoggedIn ? <Main /> : <OnBoarding showInfo={showInfo} onToggle={toggleShowInfo} />}
    </div>
  );
}

export default App;
