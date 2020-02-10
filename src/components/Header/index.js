import React from 'react';
import PropTypes from 'prop-types';

import { MdHelp } from 'react-icons/md';

import style from './style.module.scss';

const Header = ({ onToggle }) => {
  return (
    <div className={style.header}>
      BlockParty Wallet
      <div className={style.info}>
        <MdHelp onClick={onToggle} />
      </div>
    </div>
  );
};

Header.propTypes = {
  onToggle: PropTypes.func.isRequired
};

export default Header;
