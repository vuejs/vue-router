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
 *                 - {Boolean} hashbang  (default: true)
 *                 - {Boolean} history (default: false)
 *                 - {Boolean} abstract (default: false)
 *                 - {Boolean} saveScrollPosition (default: false)
 *                 - {Boolean} transitionOnLoad (default: false)
 *                 - {Boolean} suppressTransitionError (default: false)
 *                 - {String} root (default: null)
 *                 - {String} linkActiveClass (default: 'v-link-active')
 */

function Router (options) {
  /* istanbul ignore if */
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
  this._currentRoute = {}
  this._currentTransition = null
  this._notFoundHandler = null
  this._beforeEachHook = null

  // feature detection
  this._hasPushState = typeof history !== 'undefined' && history.pushState

  // trigger transition on initial render?
  this._rendered = false
  this._transitionOnLoad = options.transitionOnLoad

  // history mode
  this._abstract = !!options.abstract
  this._hashbang = options.hashbang !== false
  this._history = !!(this._hasPushState && options.history)

  // other options
  this._saveScrollPosition = !!options.saveScrollPosition
  this._linkActiveClass = options.linkActiveClass || 'v-link-active'
  this._suppress = !!options.suppressTransitionError

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
