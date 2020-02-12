import { useEffect, useState } from 'react';
import { getWallet, importWallet } from './importWallet';
import { generateMnemonic } from './generateMnemonic';
import getBalance from './getBalance';
import getTokenInfo from './getTokenInfo';

const tokensCache = {};

const sortTokens = tokens => tokens.sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1));

const updateTokensInfo = async (slpAddress, tokens = [], setTokens) => {
  const result = [];
  tokens.forEach(async (token, i) => {
    if (!token.info) {
      try {
        const info = await getTokenInfo(slpAddress, token.tokenId);

        tokensCache[token.tokenId] = { ...token, info };
        tokens[i] = { ...token, info };
        setTokens(sortTokens([...tokens]));
        result.push(token);
      } catch (err) {
        console.log('error', err);
      }
    }
  });
};

const update = async ({ wallet, setBalances, setTokens }) => {
  try {
    if (!wallet) {
      return;
    }

    const balance = await getBalance(wallet, false);
    setBalances(balance);

    const tokens = balance.tokens.map(token => {
      if (tokensCache[token.tokenId]) {
        return {
          ...token,
          info: tokensCache[token.tokenId].info
        };
      } else {
        return token;
      }
    });

    setTokens(sortTokens(tokens));
    await updateTokensInfo(wallet.slpAddress, tokens, setTokens);
  } catch (error) {
    console.log('update error', error.message || error.error);
  }
};

export const useWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const w = getWallet();
    if (w) {
      setWallet(w);
      update({ wallet: w, setBalances, setTokens });
    }

    const routineId = setInterval(() => {
      update({ wallet: getWallet(), setBalances, setTokens });
    }, 10000);

    return () => {
      clearInterval(routineId);
    };
  }, []);

  return {
    mnemonic,
    wallet,
    balances,
    tokens,
    update: () => update({ wallet, tokens, setBalances, setTokens }),
    updateTokensInfo: () => updateTokensInfo(tokens, setTokens),
    importWallet: payload => {
      const newWallet = importWallet(payload);
      setWallet(newWallet);
      update({ wallet: newWallet, tokens, setBalances, setTokens });
    },
    generateMnemonic: () => {
      setMnemonic(generateMnemonic());
    },
    logout: () => {
      setWallet(null);
      window.localStorage.setItem('wallet', JSON.stringify(null));
    }
  };
};
