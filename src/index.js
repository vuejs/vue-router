import util, { warn } from './util'
import initAPI from './router/api'
import initInternal from './router/internal'
import initMixin from './mixin'
import Recognizer from 'route-recognizer'
import View from './directives/view'
import Link from './directives/link'
import AbstractHistory from './history/abstract'
import HashHistory from './history/hash'
import HTML5History from './history/html5'

const historyBackends = {
  abstract: AbstractHistory,
  hash: HashHistory,
  html5: HTML5History
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
    linkActiveClass = 'v-link-active',
    linkActiveExactClass = 'v-link-active-exact'
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
    this._startCb = null
    this._currentRoute = {}
    this._currentTransition = null
    this._previousTransition = null
    this._notFoundHandler = null
    this._beforeEachHooks = []
    this._afterEachHooks = []

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
    this._linkActiveExactClass = linkActiveExactClass
    this._suppress = suppressTransitionError

    // create history object
    let inBrowser = util.Vue.util.inBrowser
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

/**
 * Installation interface.
 * Install the necessary directives.
 */

Router.install = function (Vue) {
  /* istanbul ignore if */
  if (Router.installed) {
    warn('already installed.')
    return
  }
  initAPI(Vue, Router)
  initInternal(Vue, Router)
  initMixin(Vue)
  View(Vue)
  Link(Vue)
  util.Vue = Vue
  // 1.0 only: enable route mixins
  var strats = Vue.config.optionMergeStrategies
  if (strats) {
    // use the same merge strategy as methods (object hash)
    strats.route = strats.methods
  }
  Router.installed = true
}

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Router)
}

export default Router
