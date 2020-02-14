import React from 'react';
import PropTypes from 'prop-types';

import Img from 'react-image';
import Jdenticon from 'react-jdenticon';

import { tokenBaseUrl } from 'constants/config';

import style from './style.module.scss';

const Balance = ({ balances, tokens }) => {
  if (!balances) return null;

  return (
    <div className={style.container}>
      <h4>{balances.balance} BCH</h4>

      {tokens &&
        tokens.map(token => (
          <div key={token.id} className={style.row}>
            <div>
              <Img
                width="25"
                src={`${tokenBaseUrl}/${token.id}.png`}
                unloader={<Jdenticon size="25" value={token.id} />}
              />
            </div>

            <label className={style.name}>{token.name}</label>

            <span className={style.symbol}>{token.symbol}</span>

            <span className={style.balance}>
              {balances.tokens.find(item => item.tokenId === token.id).balance}
            </span>
          </div>
        ))}
    </div>
  );
};

Balance.propTypes = {
  balances: PropTypes.object,
  tokens: PropTypes.array.isRequired
};

export default Balance;
