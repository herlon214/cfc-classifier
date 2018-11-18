import test from 'ava'
import CFC from '../src'

test('Generate unique terms', t => {
  const categories = ['a']
  const corpus = [['a simple text, with some! interesting. things;a simple text, with some! interesting. things;']]
  const cfc = new CFC(categories, corpus)

  const tokens = cfc.generateTokens(cfc.corpus)
  const terms = cfc.generateUniqueTerms(tokens)

  t.deepEqual([ 'a', 'simple', 'text', 'with', 'some', 'interesting', 'things' ], terms)
})
