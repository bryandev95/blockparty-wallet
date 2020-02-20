import { useEffect, useState } from 'react';

import { getWallet, importWallet } from './importWallet';
import { generateMnemonic, getBalance, getTransactions } from './utils';

const update = async ({ wallet, setBalances, setTransactions }) => {
  try {
    if (!wallet) {
      return;
    }

    const balance = await getBalance(wallet);
    const transactions = await getTransactions(wallet);
    setTransactions(transactions);
    setBalances(balance);
  } catch (error) {
    console.log('Error updating balance and transactions : ', error.message || error.error);
  }
};

export const useWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const w = getWallet();
    if (w) {
      setWallet(w);
      update({ wallet: w, setBalances, setTransactions });
    }

    const routineId = setInterval(() => {
      update({ wallet: getWallet(), setBalances, setTransactions });
    }, 10000);

    return () => {
      clearInterval(routineId);
    };
  }, []);

  return {
    mnemonic,
    wallet,
    balances,
    transactions,
    importWallet: payload => {
      const newWallet = importWallet(payload);
      setWallet(newWallet);
      update({ wallet: newWallet, setBalances, setTransactions });
    },
    generateMnemonic: () => {
      setMnemonic(generateMnemonic());
    },
    logout: () => {
      setWallet(null);
      setBalances({});
      window.localStorage.setItem('wallet', JSON.stringify(null));
    }
  };
};
