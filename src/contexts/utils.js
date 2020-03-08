import SLPSDK from 'slp-sdk';
import { bitcore } from 'slpjs';
import _ from 'lodash';

import { restURL, cashExplorer, slpDBUrl, bitDBUrl } from 'constants/config';

const sb = require('satoshi-bitcoin');
const explorer = require('bitcore-explorers');

const SLP = new SLPSDK({ restURL });

const slpBaseUrl = localStorage.getItem('slpBase') || slpDBUrl;
const bchBaseUrl = localStorage.getItem('bchBase') || bitDBUrl;

export const getSLP = () => {
  return SLP;
};

export const generateMnemonic = () => {
  return SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()['english']);
};

export const getTokenInfo = async slpAddress => {
  const query = {
    v: 3,
    q: {
      db: ['g'],
      aggregate: [
        {
          $match: {
            'graphTxn.outputs': {
              $elemMatch: {
                address: slpAddress,
                status: 'UNSPENT',
                slpAmount: { $gte: 0 }
              }
            }
          }
        },
        { $unwind: '$graphTxn.outputs' },
        {
          $match: {
            'graphTxn.outputs.address': slpAddress,
            'graphTxn.outputs.status': 'UNSPENT',
            'graphTxn.outputs.slpAmount': { $gte: 0 }
          }
        },
        {
          $project: {
            amount: '$graphTxn.outputs.slpAmount',
            address: '$graphTxn.outputs.address',
            txid: '$graphTxn.txid',
            vout: '$graphTxn.outputs.vout',
            tokenId: '$tokenDetails.tokenIdHex'
          }
        },
        {
          $group: { _id: '$tokenId', amount: { $sum: '$amount' }, address: { $first: '$address' } }
        },
        {
          $lookup: {
            from: 'tokens',
            localField: '_id',
            foreignField: 'tokenDetails.tokenIdHex',
            as: 'token'
          }
        }
      ]
    }
  };

  const b64 = btoa(JSON.stringify(query));

  const url = `${slpBaseUrl}/${b64}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const { g: data } = await response.json();
      const tokens = data.map(item => ({
        id: item._id,
        ...item.token[0].tokenDetails,
        balance: parseInt(item.amount)
      }));
      return tokens;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error while getting tokens: ', err);
    return [];
  }
};

export const getTransactions = async wallet => {
  try {
    return await SLP.Address.transactions(wallet.cashAddress);
  } catch (err) {
    console.log('Error in getTransaction: ', err.message || err);
    return [];
  }
};

export const getSLPTransactions = async slpAddress => {
  try {
    const query = {
      v: 3,
      q: {
        db: ['c', 'u'],
        find: {
          $or: [
            {
              'in.e.a': slpAddress
            },
            {
              'out.e.a': slpAddress
            }
          ]
        },
        sort: {
          'blk.i': -1
        },
        limit: 100
      },
      r: {
        f: '[.[] | { txid: .tx.h, tokenDetails: .slp, blk: .blk, in, out } ]'
      }
    };

    const b64 = btoa(JSON.stringify(query));

    const url = `${slpBaseUrl}/${b64}`;

    const response = await fetch(url);
    if (response.ok) {
      const { u: unConfirmed, c: confirmed } = await response.json();
      return [...unConfirmed, ...confirmed];
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error while getting SLP transactions: ', err);
    return [];
  }
};

export const getBCHTransactions = async cashAddress => {
  try {
    const query = {
      v: 3,
      q: {
        db: ['c', 'u'],
        find: {
          $or: [
            {
              'in.e.a': cashAddress.slice(12)
            },
            {
              'out.e.a': cashAddress.slice(12)
            }
          ]
        }
      }
    };

    const b64 = btoa(JSON.stringify(query));

    const url = `${bchBaseUrl}/${b64}`;

    const response = await fetch(url);
    if (response.ok) {
      const { u: unConfirmed, c: confirmed } = await response.json();
      return [...unConfirmed, ...confirmed];
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error while getting SLP transactions: ', err);
    return [];
  }
};

export const getBalance = async wallet => {
  try {
    return await SLP.Address.details(wallet.cashAddress);
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

export const sendBCH = async (wallet, receiverAddress, amount, cb) => {
  try {
    const { cashAddress, fundingWif } = wallet;
    if (bitcore.Address.isValid(receiverAddress)) {
      const privateKey = bitcore.PrivateKey(fundingWif);
      const satoshis = sb.toSatoshi(amount) | 0;

      let tx = bitcore.Transaction();

      const utxos = await getUtxos(cashAddress);
      tx.from(utxos);
      tx.to(receiverAddress, satoshis);
      tx.feePerKb(1500);
      tx.change(privateKey.toAddress());

      tx = cleanTxDust(tx);
      tx.sign(privateKey);

      const insight = new explorer.Insight(cashExplorer);

      insight.broadcast(tx.serialize(), cb);
    } else {
      throw { message: 'Invalid address' };
    }
  } catch (err) {
    console.log('Error in sending BCH : ', err);
    cb(err);
  }
};

export const cleanTxDust = tx => {
  for (let i = 0; i < tx.outputs.length; ++i) {
    if (tx.outputs[i]._satoshis > 0 && tx.outputs[i]._satoshis < 546) {
      tx.outputs.splice(i, 1);
      --i;
    }
  }

  return tx;
};

export const getUtxos = async address => {
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

export const getBlockCount = async () => {
  try {
    const query = {
      v: 3,
      q: {
        db: ['s'],
        find: {},
        limit: 10
      }
    };

    const b64 = btoa(JSON.stringify(query));

    const url = `${slpBaseUrl}/${b64}`;

    const response = await fetch(url);

    if (response.ok) {
      const { s: res } = await response.json();

      return res && res[0] && res[0].bchBlockHeight;
    } else {
      return 0;
    }
  } catch (error) {
    console.log('Error while getting Block count: ', error);
  }
};

export const getTrans = (slpTrans, bchTrans) => {
  let res = [];
  slpTrans.forEach(tx => {
    res.push({ ...tx, isSLP: true });
  });

  bchTrans.forEach(tx => {
    res.push({ ...tx, txid: tx.tx.h, isSLP: false });
  });

  res = _.uniqBy(res, 'txid');

  return _.orderBy(res, ['blk.t'], ['desc']);
};
