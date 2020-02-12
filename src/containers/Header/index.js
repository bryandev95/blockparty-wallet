import React from 'react';
import PropTypes from 'prop-types';

import { MdHelp, MdSettings } from 'react-icons/md';

import style from './style.module.scss';

const Header = ({ isLoggedIn, onToggle }) => {
  return (
    <div className={style.header}>
      BlockParty Wallet
      <div className={style.info}>
        {isLoggedIn ? <MdSettings onClick={onToggle} /> : <MdHelp onClick={onToggle} />}
      </div>
    </div>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Header;
