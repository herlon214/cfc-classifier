import test from 'ava'
import CFC from '../src'

test('Generate unique terms', t => {
  const categories = ['a']
  const corpus = [['a simple text, with some! interesting. things;a simple text, with some! interesting. things;']]
  const cfc = new CFC(categories, corpus)

  const tokens = cfc.generateTokens(cfc.corpus)
  const terms = cfc.generateUniqueTerms(tokens)
  const occurrences = cfc.countTermOccurrences(terms, tokens, categories)

  const expected = {
    _a: [ 1 ],
    _simple: [ 1 ],
    _text: [ 1 ],
    _with: [ 1 ],
    _some: [ 1 ],
    _interesting: [ 1 ],
    _things: [ 1 ]
  }

  t.deepEqual(expected, occurrences)
})
