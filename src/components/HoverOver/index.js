import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { MdClose, MdExitToApp } from 'react-icons/md';
import Button from 'components/Button';

import style from './style.module.scss';

const HoverOver = ({ isLoggedIn, showInfo, onToggle, onLogout }) => {
  const renderInfo = () => {
    return (
      <React.Fragment>
        <h2>
          Help
          <MdClose className={style.closeBtn} onClick={onToggle} />
        </h2>
        <p>
          The Blockparty Wallet keeps your private key on your computer. If you don't already have a
          Bitcoin address you can download the 12 word mnemonic. Please ensure you keep it safe as
          anyone who has it can send your funds. Many people choose to write it down on a piece of
          paper (or two) and store it somewhere secure. Once you have saved your key, click "Import"
          and type it in. When you want to logout just click the settings button on the top and
          click the "Logout" button.
          <br /> If you'd like to learn more about private keys, this article{' '}
          <a href="https://en.bitcoin.it/wiki/Private_key">Bitcoin Wiki</a> has more information. If
          you'd like to learn more about the Blockparty Wallet or need more help visit the{' '}
          <a href="https://blockparty.sh">Website</a> and say hello.
        </p>
      </React.Fragment>
    );
  };

  const renderSettings = () => {
    const commitHash = 'e671837298f2c19b682778c0bd9942a411c00a0a';
    return (
      <React.Fragment>
        <h2>
          Settings
          <MdClose className={style.closeBtn} onClick={onToggle} />
        </h2>

        <Button color="success" onClick={onLogout}>
          <span>
            LOGOUT
            <MdExitToApp />
          </span>
        </Button>

        <div className={style.footer}>
          <label>blockparty wallet</label>
          <br />
          <span>
            commit
            <a href={`https://github.com/coldflame426/blockparty-wallet/commit/${commitHash}`}>
              {commitHash}
            </a>
          </span>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className={cx(style.container, { [style.active]: showInfo })}>
      {!isLoggedIn ? renderInfo() : renderSettings()}
    </div>
  );
};

HoverOver.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  showInfo: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default HoverOver;
