import { useEffect, useState } from 'react';

import { getWallet, importWallet } from './importWallet';
import { generateMnemonic, getBalance, getTransactions, getTokenInfo } from './utils';
import { socketServerUrl } from 'constants/config';

const update = async ({ wallet, setBalances, setTransactions, setTokens, setLoading }) => {
  try {
    if (!wallet) {
      return;
    }

    setLoading(true);
    const balance = await getBalance(wallet);
    const transactions = await getTransactions(wallet);
    const tokens = await getTokenInfo(balance.tokens);
    setTransactions(transactions.txs);
    setBalances(balance);
    setTokens(tokens);
    setLoading(false);
  } catch (error) {
    console.log('Error updating balance and transactions : ', error.message || error.error);
  }
};

export const useWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [balances, setBalances] = useState({});
  const [isLoading, setLoading] = useState({});
  const [transactions, setTransactions] = useState([]);

  const openSocket = ({ slpAddress }) => {
    const query = {
      v: 3,
      q: {
        find: {
          'in.e.a': slpAddress,
          'out.e.a': slpAddress
        }
      }
    };

    const b64 = btoa(JSON.stringify(query));

    const url = `${socketServerUrl}/${b64}`;

    const socket = new EventSource(url);

    socket.onmessage = () => {
      update({ wallet: getWallet(), setBalances, setTransactions, setTokens, setLoading });
    };
  };

  useEffect(() => {
    const w = getWallet();
    if (w) {
      setWallet(w);
      update({ wallet: w, setBalances, setTransactions, setTokens, setLoading });
      openSocket(w);
    }
  }, []);

  return {
    mnemonic,
    wallet,
    isLoading,
    balances,
    tokens,
    transactions,
    importWallet: payload => {
      const newWallet = importWallet(payload);
      setWallet(newWallet);
      update({ wallet: newWallet, setBalances, setTransactions, setTokens, setLoading });
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
