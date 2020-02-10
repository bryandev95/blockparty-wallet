import React, { useState } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import OnBoarding from './components/OnBoarding';
import styles from './app.module.scss';

function App() {
  const [isLoggedIn] = useState(false);

  return (
    <div className={styles.app}>
      <Header isLoggedIn={isLoggedIn} />

      {isLoggedIn ? <Main /> : <OnBoarding />}
    </div>
  );
}

export default App;
