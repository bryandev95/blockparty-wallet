import { useEffect, useState } from 'react';
import { getWallet, importWallet } from './importWallet';
import { generateMnemonic } from './generateMnemonic';
import getBalance from './getBalance';

const update = async ({ wallet, setBalances }) => {
  try {
    if (!wallet) {
      return;
    }

    const balance = await getBalance(wallet, false);
    setBalances(balance);
  } catch (error) {
    console.log('update error', error.message || error.error);
  }
};

export const useWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const w = getWallet();
    if (w) {
      setWallet(w);
      update({ wallet: w, setBalances });
    }

    const routineId = setInterval(() => {
      update({ wallet: getWallet(), setBalances });
    }, 10000);

    return () => {
      clearInterval(routineId);
    };
  }, []);

  return {
    mnemonic,
    wallet,
    balances,
    update: () => update({ wallet, setBalances }),
    importWallet: payload => {
      const newWallet = importWallet(payload);
      setWallet(newWallet);
      update({ wallet: newWallet, setBalances });
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
