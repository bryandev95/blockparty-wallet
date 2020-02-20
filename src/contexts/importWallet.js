import { getWalletDetails } from './utils';

export const getWallet = () => {
  const wallet = JSON.parse(localStorage.getItem('wallet'));

  return wallet;
};

export const importWallet = payload => {
  const outObj = {};

  const walletDetails = getWalletDetails(payload);

  outObj.cashAddress = walletDetails.cashAddress;
  outObj.slpAddress = walletDetails.slpAddress;
  outObj.legacyAddress = walletDetails.legacyAddress;

  window.localStorage.setItem('wallet', JSON.stringify(outObj));

  return outObj;
};
