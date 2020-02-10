import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import style from './style.module.scss';

const WalletInfo = ({ showInfo, onToggle }) => {
  return (
    <div className={cx(style.container, { [style.active]: showInfo })}>
      <h2>
        Help
        <span className={style.closeBtn} onClick={onToggle}>
          &times;
        </span>
      </h2>
      <p>
        The Blockparty Wallet keeps your private key on your computer. If you don't already have a
        Bitcoin address you can download the 12 word mnemonic. Please ensure you keep it safe as
        anyone who has it can send your funds. Many people choose to write it down on a piece of
        paper (or two) and store it somewhere secure. Once you have saved your key, click "Import"
        and type it in. When you want to logout just click the settings button on the top and click
        the "Logout" button.
        <br /> If you'd like to learn more about private keys, this article{' '}
        <a href="https://en.bitcoin.it/wiki/Private_key">Bitcoin Wiki</a> has more information. If
        you'd like to learn more about the Blockparty Wallet or need more help visit the{' '}
        <a href="https://blockparty.sh">Website</a> and say hello.
      </p>
    </div>
  );
};

WalletInfo.propTypes = {
  showInfo: PropTypes.bool.isRequired,
  onToggle: PropTypes.bool.isRequired
};

export default WalletInfo;
