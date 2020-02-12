import { bitcore } from 'slpjs';
import withSLP from './withSLP';

const getWalletDetails = (SLPInstance, { mnemonic, wif }) => {
  if (mnemonic) {
    const rootSeedBuffer = SLPInstance.Mnemonic.toSeed(mnemonic);
    const masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer);

    // eslint-disable-next-line
      const hdNodeBip44Account = SLPInstance.HDNode.derivePath(masterHDNode, "m/44'/245'/0");
    const change = SLPInstance.HDNode.derivePath(hdNodeBip44Account, '0/0');
    const cashAddress = SLPInstance.HDNode.toCashAddress(change);
    const slpAddress = SLPInstance.Address.toSLPAddress(cashAddress);

    return {
      cashAddress,
      slpAddress,
      legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress),
      fundingWif: SLPInstance.HDNode.toWIF(change)
    };
  } else {
    const address = bitcore.PrivateKey(wif).toAddress();
    const cashAddress = address.toString(bitcore.Address.CashAddrFormat);
    const slpAddress = SLPInstance.Address.toSLPAddress(cashAddress);

    return {
      cashAddress,
      slpAddress,
      legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress),
      fundingWif: wif
    };
  }
};

export default withSLP(getWalletDetails);
