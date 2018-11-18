import test from 'ava'
import CFC from '../src'

test('Tokenize documents', t => {
  const categories = ['a']
  const corpus = [['a simple text, with some! interesting. things;a simple text, with some! interesting. things;']]
  const cfc = new CFC(categories, corpus)

  const tokens = cfc.generateTokens(cfc.corpus)

  const expected = [ 'a', 'simple', 'text', 'with', 'some', 'interesting', 'things', 'a', 'simple', 'text', 'with', 'some', 'interesting', 'things' ]
  t.deepEqual([[expected]], tokens)
})
