import SLPSDK from 'slp-sdk';
import { bitcore } from 'slpjs';

import { restURL } from 'constants/config';

const SLP = new SLPSDK({ restURL });

export const generateMnemonic = () => {
  const lang = 'english';

  return SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
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
