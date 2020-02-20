import React, { useContext } from 'react';
import cx from 'classnames';

import { WalletContext } from 'contexts/WalletContext';

import style from './style.module.scss';

const Actions = () => {
  const { transactions } = useContext(WalletContext);

  const formatDate = date => {
    const day = date.getDate();
    // const month = date.getMonth() + 1;
    const month = 11;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day} ${hours}:${minutes}`;
  };

  if (!transactions.txs) return <div className={style.noTransaction}>No transaction</div>;
  return (
    <div className={style.container}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Confirms</th>
            <th>Inputs</th>
            <th>Outputs</th>
            <th>Amount</th>
            <th>Size</th>
          </tr>
        </thead>

        <tbody>
          {transactions.txs.map(tx => (
            <tr key={tx.txid}>
              <td>{formatDate(new Date(tx.time * 1000))}</td>
              <td>
                <a
                  href={`https://explorer.bitcoin.com/bch/tx/${tx.txid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.txid}
                </a>
              </td>
              <td>{tx.confirmations}</td>
              <td>{tx.vin.length}</td>
              <td>{tx.vout.length}</td>
              <td>
                <span
                  className={cx(style.balance, { [style.minus]: tx.valueIn - tx.valueOut < 0 })}
                >
                  {tx.valueIn - tx.valueOut > 0 && '+'}
                  {(tx.valueIn - tx.valueOut).toFixed(8)}
                </span>
              </td>
              <td>{tx.size / 1000}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Actions;
