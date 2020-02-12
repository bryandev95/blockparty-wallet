import SLPSDK from 'slp-sdk';
import { restURL } from 'constants/config';

export default callback => {
  const SLPInstance = new SLPSDK({ restURL });

  return (...args) => callback(SLPInstance, ...args);
};
