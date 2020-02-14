import withSLP from 'contexts/withSLP';

const getTokenInfo = async (SLP, tokens) => {
  const tokenIds = tokens.map(token => token.tokenId);

  const tokenList = await SLP.Utils.list(tokenIds);

  return tokenList;
};

export default withSLP(getTokenInfo);
