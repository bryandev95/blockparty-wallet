import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { ClipLoader } from 'react-spinners';
import Img from 'react-image';
import Jdenticon from 'react-jdenticon';

import { tokenBaseUrl } from 'constants/config';

import { getTokenInfo } from 'contexts/utils';

import style from './style.module.scss';

const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const Balance = ({ balances }) => {
  const [isLoading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const prevBalance = usePrevious(balances);
  if (!balances) return null;

  useEffect(() => {
    if (!balances.tokens) return;

    setLoading(true);
    getTokenInfo(balances.tokens)
      .then(response => {
        setLoading(false);
        setTokens(response);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [prevBalance]);

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
                    unloader={<Jdenticon size="20" value={token.id} />}
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

      {isLoading && (
        <div className={style.loaderContainer}>
          <ClipLoader size="35px" />
        </div>
      )}
    </div>
  );
};

Balance.propTypes = {
  balances: PropTypes.object
};

export default Balance;
