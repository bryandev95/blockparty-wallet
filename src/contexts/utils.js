import SLPSDK from 'slp-sdk';
import { bitcore } from 'slpjs';

import { restURL, cashExplorer } from 'constants/config';

const sb = require('satoshi-bitcoin');
const explorer = require('bitcore-explorers');

const SLP = new SLPSDK({ restURL });

export const getSLP = () => {
  return SLP;
};

export const generateMnemonic = () => {
  return SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()['english']);
};

export const getTokenInfo = async tokens => {
  const tokenIds = tokens.map(token => token.tokenId);

  const tokenList = await SLP.Utils.list(tokenIds);

  return tokenList;
};

export const getTransactions = async wallet => {
  try {
    return await SLP.Address.transactions(wallet.cashAddress);
  } catch (err) {
    console.log('Error in getTransaction: ', err.message || err);
    return [];
  }
};

export const getBalance = async wallet => {
  try {
    let bchBalance = await SLP.Address.details(wallet.cashAddress);

    const slpBalance = await SLP.Utils.balancesForAddress(wallet.slpAddress);
    bchBalance.tokens = slpBalance;

    return bchBalance;
  } catch (err) {
    console.log('Error in getBalance: ', err.message || err);
    throw err;
  }
};

export const getWalletDetails = ({ mnemonic, wif }) => {
  if (mnemonic) {
    const rootSeedBuffer = SLP.Mnemonic.toSeed(mnemonic);
    const masterHDNode = SLP.HDNode.fromSeed(rootSeedBuffer);

    // eslint-disable-next-line
    const hdNodeBip44Account = SLP.HDNode.derivePath(masterHDNode, "m/44'/245'/0");
    const change = SLP.HDNode.derivePath(hdNodeBip44Account, '0/0');
    const cashAddress = SLP.HDNode.toCashAddress(change);
    const slpAddress = SLP.Address.toSLPAddress(cashAddress);

    return {
      cashAddress,
      slpAddress,
      legacyAddress: SLP.Address.toLegacyAddress(cashAddress),
      fundingWif: SLP.HDNode.toWIF(change)
    };
  } else {
    const address = bitcore.PrivateKey(wif).toAddress();
    const cashAddress = address.toString(bitcore.Address.CashAddrFormat);
    const slpAddress = SLP.Address.toSLPAddress(cashAddress);

    return {
      cashAddress,
      slpAddress,
      legacyAddress: SLP.Address.toLegacyAddress(cashAddress),
      fundingWif: wif
    };
  }
};

export const sendToken = (wallet, payload) => {
  const { slpAddress, cashAddress, fundingWif } = wallet;
  const { address, type, amount } = payload;

  return SLP.TokenType1.send({
    fundingAddress: slpAddress,
    fundingWif,
    tokenReceiverAddress: address,
    bchChangeReceiverAddress: cashAddress,
    tokenId: type,
    amount
  });
};

export const sendBCH = async (wallet, receiveAddress, amount, cb) => {
  try {
    const { cashAddress, fundingWif } = wallet;
    if (!bitcore.Address.isValid(receiveAddress)) {
      throw new Error('Invalid address');
    }

    const privateKey = bitcore.PrivateKey(fundingWif);
    const satoshis = sb.toSatoshi(amount) | 0;

    let tx = bitcore.Transaction();

    const utxos = await getUtxos(cashAddress);
    tx.from(utxos);
    tx.to(receiveAddress, satoshis);
    tx.feePerKb(1500);
    tx.change(privateKey.toAddress());

    tx = cleanTxDust(tx);
    tx.sign(privateKey);

    const insight = new explorer.Insight(cashExplorer);

    insight.broadcast(tx.toString(), cb);
  } catch (err) {
    console.log('Error in sending BCH : ', err);
    throw err;
  }
};

const cleanTxDust = tx => {
  for (let i = 0; i < tx.outputs.length; ++i) {
    if (tx.outputs[i]._satoshis > 0 && tx.outputs[i]._satoshis < 546) {
      tx.outputs.splice(i, 1);
      --i;
    }
  }

  return tx;
};

const getUtxos = async address => {
  const utxo = await SLP.Address.utxo(address);

  const utxos = utxo.utxos.map(item => ({
    txId: item.txid,
    address,
    outputIndex: item.vout,
    script: utxo.scriptPubKey,
    satoshis: item.satoshis
  }));

  utxos.sort((a, b) => (a.satoshis > b.satoshis ? 1 : a.satoshis < b.satoshis ? -1 : 0));

  return utxos;
};
