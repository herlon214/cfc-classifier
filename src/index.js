// Libs
const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const _ = require('lodash')
const similarity = require('compute-cosine-similarity')

/**
 * Class Feature Centroid Classifier
 * based in the article of Hu Guan et al.
 * http://www2009.eprints.org/21/1/p201.pdf
 */
class ClassFeatureCentroid {
  constructor (categories, corpus) {
    this.occurrences = {}
    this.b = Math.E - 1.7
    this.centroids = []
    this.corpusTokens = []
    this.terms = []
    this.categories = categories
    this.corpus = corpus
    this.trainSize = 0
    this.parsingSteps = [
      // Tokenize corpus
      (text) => tokenizer.tokenize(text)
    ]
  }

  /**
   * Generate toknes of the documents in the given corpus
   */
  generateTokens (corpus) {
    return corpus.map(documents => {
      return documents.map(text => {
        return this.parsingSteps.reduce((result, step) => step(result), text)
      })
    })
  }

  /**
   * Insert a new step function in the parsing steps
   * this function will be called by generateTokens while parsing a text
   * The argument function will receive in the first param every text token
   * and it should return a parsed result
   */
  addParsingStep (fn) {
    this.parsingSteps.push(fn)
  }

  /**
   * Generate an array removing the duplications
   */
  generateUniqueTerms (tokens) {
    return _.uniq(
      tokens.reduce(
        (acc, documents) => {
          documents.forEach(
            tokens => tokens.forEach(token => acc.push(token))
          )
          return acc
        }, [])
    )
  }

  /**
   * Count how many times a term occur in the given documents
   * @returns number
   */
  count (term, documents) {
    return documents.filter(
      termsDocuments =>
        termsDocuments.filter(termDocument => termDocument === term).length > 0
    ).length
  }

  /**
   * Count how many times a term occur in the given corpus
   * @returns Occurrences object {_my: [1]}
   */
  countTermOccurrences (terms, corpusTokens, categories) {
    const occurrences = {}
    terms.forEach(term => {
      const termName = `_${term}`
      occurrences[termName] = categories.map((category, index) => this.count(term, corpusTokens[index]))
    })

    return occurrences
  }

  /**
   * Calculates the centroid arrays
   * @returns Centroid's array
   */
  generateCentroids () {
    const centroids = []
    this.categories.forEach((category, catIndex) => {
      const centroid = []
      this.terms.forEach(
        term => {
          const termName = `_${term}`
          const inner = Math.pow(this.b, (this.occurrences[termName][catIndex] / this.corpus[catIndex].length))
          const inter = Math.log(this.categories.length / this.occurrences[termName].filter(count => count > 0).length)

          centroid.push(inner * inter)
        })

      centroids.push(centroid)
    })

    return centroids
  }

  /**
   * Train the model with the given data
   * @returns Centroid's array
   */
  train () {
    this.corpusTokens = this.generateTokens(this.corpus)
    this.terms = this.generateUniqueTerms(this.corpusTokens)
    this.occurrences = this.countTermOccurrences(this.terms, this.corpusTokens, this.categories)
    this.centroids = this.generateCentroids()
    this.trainSize = this.corpus.reduce((acc, documents) => acc + documents.length, 0)

    return this.centroids
  }

  /**
   * Classify a given text into some of the trained categories
   * @param string text
   */
  classify (text) {
    const tokens = tokenizer.tokenize(text)
    const occurrences = _.countBy(tokens)
    const terms = Object.keys(occurrences)

    const tf = terms.map(term => occurrences[term] / terms.length)
    const idf = terms.map(term => {
      const occ = this.occurrences[`_${term}`]

      if (!occ) return 0

      return Math.log(this.trainSize / this.occurrences[`_${term}`].reduce((acc, count) => acc + count, 0))
    })
    const tfidf = terms.map((term, index) => tf[index] * idf[index])

    const documentVector = this.terms.map(term => {
      if (isNaN(occurrences[term])) return 0

      return tfidf[terms.indexOf(term)]
    })

    const results = this.centroids.map(centroid => {
      const categoryScore = Math.max(similarity(documentVector, centroid))

      return categoryScore
    })

    return this.categories[results.indexOf(Math.max(...results))]
  }
}

module.exports = ClassFeatureCentroid
