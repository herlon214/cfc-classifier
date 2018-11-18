import test from 'ava'
import CFC from '../src'

test('Classify a text', t => {
  const categories = ['a', 'b']
  const corpus = [['category A'], ['category B']]
  const cfc = new CFC(categories, corpus)

  cfc.train()

  t.deepEqual(cfc.classify('this text will be classified at category A'), 'a')
})
