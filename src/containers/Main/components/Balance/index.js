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
      <h4>{balances.balance + balances.unconfirmedBalance || 0} BCH</h4>

      {!!tokens && !!tokens.length && (
        <table className={style.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Token ID</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {tokens.map(token => (
              <tr key={token.id}>
                <td>
                  <Img
                    width="20"
                    src={`${tokenBaseUrl}/${token.id}.png`}
                    unloader={<Jdenticon size="25" value={token.id} />}
                  />
                  <span>{token.symbol}</span>
                </td>
                <td>{token.name}</td>
                <td>
                  <a
                    href={`https://explorer.bitcoin.com/bch/token/${token.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {token.id}
                  </a>
                </td>
                <td>
                  {balances.tokens.find(item => item.tokenId === token.id) &&
                    balances.tokens.find(item => item.tokenId === token.id).balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

Balance.propTypes = {
  balances: PropTypes.object,
  tokens: PropTypes.array.isRequired
};

export default Balance;
