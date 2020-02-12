import withSLP from './withSLP';

export const generateMnemonic = withSLP(SLP => {
  const lang = 'english';

  return SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
});
