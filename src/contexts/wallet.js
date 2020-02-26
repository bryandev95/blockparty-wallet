import React, { useContext } from 'react';

import SLPSDK from 'slp-sdk';

import { WalletContext } from 'contexts/WalletContext';
import { sendToken, sendBCH, cleanTxDust, getUtxos, generateMnemonic } from './utils';
import { importWallet } from './importWallet';

const bip39 = require('bip39');
const slpjs = require('slpjs');

const wallet = () => {
  const { balances, tokens, transactions, wallet: walletInfo } = useContext(WalletContext);

  const wallet = {};

  wallet.name = 'Blockparty Wallet';

  wallet.isLoggedIn = () => {
    if (walletInfo) return true;
    return false;
  };

  wallet.getWalletDetails = () => {
    return walletInfo;
  };

  wallet.getWif = () => {
    if (walletInfo) return walletInfo.fundingWif;
    else return '';
  };

  wallet.getSLPAddress = () => {
    if (walletInfo) return walletInfo.slpAddress;
    else return '';
  };

  wallet.getBCHAddress = () => {
    if (walletInfo) return walletInfo.cashAddress;
    else return '';
  };

  wallet.getLegacyAddress = () => {
    if (walletInfo) return walletInfo.legacyAddress;
    else return '';
  };

  wallet.getBCHBalance = () => {
    return balances.balance;
  };

  wallet.getUnconfirmedBCHBalance = () => {
    return balances.unconfirmedBalance;
  };

  wallet.getSLPTokens = () => {
    return tokens;
  };

  wallet.getTransactions = () => {
    return transactions;
  };

  wallet.sendToken = sendToken;

  wallet.sendBCH = sendBCH;

  window.wallet = wallet;

  wallet.cleanTxDust = cleanTxDust;

  wallet.getUtxos = getUtxos;

  wallet.generateMnemonic = generateMnemonic;

  wallet.importWallet = importWallet;

  wallet.libs = {
    bip39,
    SLPSDK,
    slpjs
  };

  return <div />;
};

export default wallet;
