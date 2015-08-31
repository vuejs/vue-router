import Recognizer from 'route-recognizer'

import abstract from './history/abstract'
import hash from './history/hash'
import html5 from './history/html5'

const historyBackends = {
  abstract: abstract,
  hash: hash,
  html5: html5
}

/**
 * Router constructor
 *
 * @param {Object} [options]
 */

class Router {

  constructor ({
    hashbang = true,
    abstract = false,
    history = false,
    saveScrollPosition = false,
    transitionOnLoad = false,
    suppressTransitionError = false,
    root = null,
    linkActiveClass = 'v-link-active'
  } = {}) {

    /* istanbul ignore if */
    if (!Router.installed) {
      throw new Error(
        'Please install the Router with Vue.use() before ' +
        'creating an instance.'
      )
    }

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
    this._previousTransition = null
    this._notFoundHandler = null
    this._beforeEachHook = null
    this._afterEachHook = null

    // feature detection
    this._hasPushState =
      typeof window !== 'undefined' &&
      window.history &&
      window.history.pushState

    // trigger transition on initial render?
    this._rendered = false
    this._transitionOnLoad = transitionOnLoad

    // history mode
    this._abstract = abstract
    this._hashbang = hashbang
    this._history = this._hasPushState && history

    // other options
    this._saveScrollPosition = saveScrollPosition
    this._linkActiveClass = linkActiveClass
    this._suppress = suppressTransitionError

    // create history object
    let inBrowser = Router.Vue.util.inBrowser
    this.mode = (!inBrowser || this._abstract)
      ? 'abstract'
      : this._history
        ? 'html5'
        : 'hash'

    let History = historyBackends[this.mode]
    let self = this
    this.history = new History({
      root: root,
      hashbang: this._hashbang,
      onChange: function (path, state, anchor) {
        self._match(path, state, anchor)
      }
    })
  }
}

Router.installed = false

export default Router
