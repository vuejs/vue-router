var Recognizer = require('route-recognizer')
var historyBackends = {
  abstract: require('../history/abstract'),
  hash: require('../history/hash'),
  html5: require('../history/html5')
}

/**
 * Router constructor
 *
 * @param {Object} [options]
 *                 - {String} root
 *                 - {Boolean} hashbang  (default: true)
 *                 - {Boolean} pushstate (default: false)
 */

function Router (options) {
  if (!Router.installed) {
    throw new Error(
      'Please install the Router with Vue.use() before ' +
      'creating an instance.'
    )
  }

  options = options || {}

  // Vue instances
  this.app = null
  this._views = []
  this._children = []

  // route recognizer
  this._recognizer = new Recognizer()
  this._guardRecognizer = new Recognizer()

  // state
  this._started = false
  this._currentRoute = { path: '/' }
  this._currentTransition = null

  // feature detection
  this._hasPushState = typeof history !== 'undefined' && history.pushState

  // global handler/hooks
  this._notFoundHandler = options.notFound || null
  this._beforeEachHook = options.beforeEach || null

  // other options
  this._abstract = !!options.abstract
  this._hashbang = options.hashbang !== false
  this._history = !!(this._hasPushState && options.history)
  this._saveScrollPosition = !!options.saveScrollPosition
  this._linkActiveClass = options.linkActiveClass || 'v-link-active'

  // create history object
  this.mode = this._abstract
    ? 'abstract'
    : this._history
      ? 'html5'
      : 'hash'

  var History = historyBackends[this.mode]
  var self = this
  this.history = new History({
    root: options.root,
    hashbang: this._hashbang,
    onChange: function (path, state, anchor) {
      self._match(path, state, anchor)
    }
  })
}

Router.installed = false
module.exports = Router
