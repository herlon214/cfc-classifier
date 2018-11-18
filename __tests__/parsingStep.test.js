import test from 'ava'
import CFC from '../src'

test('Remove letter A using parsing step', t => {
  const categories = ['a']
  const corpus = [['a simple text, with some! interesting. things;a simple text, with some! interesting. things;']]
  const cfc = new CFC(categories, corpus)

  // Add a parsing stepthis could be a remove
  // stopwords function or something like that
  const removeLetterA = (textTokens) => textTokens.filter(token => token.toLowerCase() !== 'a')
  cfc.addParsingStep(removeLetterA)

  const tokens = cfc.generateTokens(cfc.corpus)

  const expected = [ 'simple', 'text', 'with', 'some', 'interesting', 'things', 'simple', 'text', 'with', 'some', 'interesting', 'things' ]
  t.deepEqual([[expected]], tokens)
})
