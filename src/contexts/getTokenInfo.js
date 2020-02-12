import withSLP from './withSLP';

const getTokenInfo = async (SLP, slpAddress, tokenId) => {
  try {
    const info = await SLP.Utils.list(tokenId);

    return info;
  } catch (error) {
    console.error(error);
  }
};

export default withSLP(getTokenInfo);
