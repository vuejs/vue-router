var Recognizer = require('route-recognizer')
var hasPushState = typeof history !== 'undefined' && history.pushState
var installed = false
var Vue

/**
 * Router constructor
 *
 * @param {Object} [options]
 *                 - {String} root
 *                 - {Boolean} hashbang  (default: true)
 *                 - {Boolean} pushstate (default: false)
 */

function VueRouter (options) {
  this.app = null
  this._recognizer = new Recognizer()
  this._started = false
  this._currentPath = null
  this._notfoundHandler = null
  this._root = null
  this._hasPushState = hasPushState
  var root = options && options.root
  if (root) {
    // make sure there's the starting slash
    if (root.charAt(0) !== '/') {
      root = '/' + root
    }
    // remove trailing slash
    this._root = root.replace(/\/$/, '')
  }
  this._hashbang = !(options && options.hashbang === false)
  this._pushstate = !!(hasPushState && options && options.pushstate)
}

/**
 * Installation interface.
 * Install the necessary directives.
 */

VueRouter.install = function (ExternalVue) {
  if (installed) {
    warn('vue-router has already been installed.')
    return
  }
  Vue = ExternalVue
  installed = true
  require('./view')(Vue)
  require('./link')(Vue)
}

//
// Public API
//
//

var p = VueRouter.prototype

/**
 * Register a map of top-level paths.
 */

p.map = function (map) {
  for (var route in map) {
    this.on(route, map[route])
  }
}

/**
 * Register a single root-level path
 *
 * @param {String} rootPath
 * @param {Object} config
 *                 - {String} component
 *                 - {Object} [subRoutes]
 *                 - {Boolean} [forceRefresh]
 *                 - {Function} [before]
 *                 - {Function} [after]
 */

p.on = function (rootPath, config) {
  if (rootPath === '*') {
    this.notfound(config)
  } else {
    this._addRoute(rootPath, config, [])
  }
}

/**
 * Set the notfound route config.
 *
 * @param {Object} config
 */

p.notfound = function (config) {
  this._notfoundHandler = [{ handler: config }]
}

/**
 * Set redirects.
 *
 * @param {Object} map
 */

p.redirect = function (map) {
  // TODO
  // use another recognizer to recognize redirects
}

/**
 * Navigate to a given path.
 * The path is assumed to be already decoded, and will
 * be resolved against root (if provided)
 *
 * @param {String} path
 * @param {Object} [options]
 */

p.go = function (path, options) {
  var replace = options && options.replace
  if (this._pushstate) {
    // make it relative to root
    path = this._root
      ? this._root + '/' + path.replace(/^\//, '')
      : path
    if (replace) {
      history.replaceState({}, '', path)
    } else {
      history.pushState({}, '', path)
    }
    this._match(path)
  } else {
    path = path.replace(/^#!?/, '')
    var hash = this._hashbang
      ? '!' + path
      : path
    setHash(hash, replace)
  }
}

/**
 * Start the router.
 *
 * @param {VueConstructor} App
 * @param {String|Element} container
 */

p.start = function (App, container) {
  if (!installed) {
    throw new Error(
      'Please install vue-router with Vue.use() before ' +
      'starting the router.'
    )
  }
  if (this._started) {
    warn('vue-router has already been started.')
    return
  }
  this._started = true
  if (!this.app) {
    if (!App || !container) {
      throw new Error(
        'Must start vue-router with a component and a ' +
        'root container.'
      )
    }
    this._appContainer = container
    this._appConstructor = typeof App === 'function'
      ? App
      : Vue.extend(App)
  }
  if (this._pushstate) {
    this._initHistoryMode()
  } else {
    this._initHashMode()
  }
}

/**
 * Stop listening to route changes.
 */

p.stop = function () {
  var event = this._pushstate
    ? 'popstate'
    : 'hashchange'
  window.removeEventListener(event, this._onRouteChange)
  this._started = false
}

//
// Private Methods
//

/**
 * Initialize hash mode.
 */

p._initHashMode = function () {
  var self = this
  this._onRouteChange = function () {
    // format hashbang
    var hash = location.hash
    if (self._hashbang && hash && hash.charAt(1) !== '!') {
      setHash('!' + hash.slice(1), true)
      return
    }
    if (!self._hashbang && hash && hash.charAt(1) === '!') {
      setHash(hash.slice(2), true)
      return
    }
    hash = hash.replace(/^#!?/, '')
    var url = hash + location.search
    url = decodeURI(url)
    self._match(url)
  }
  window.addEventListener('hashchange', this._onRouteChange)
  this._onRouteChange()
}

/**
 * Initialize HTML5 history mode.
 */

p._initHistoryMode = function () {
  var self = this
  this._onRouteChange = function () {
    var url = location.pathname + location.search
    url = decodeURI(url)
    self._match(url)
  }
  window.addEventListener('popstate', this._onRouteChange)
  this._onRouteChange()
}

/**
 * Add a route containing a list of segments to the internal
 * route recognizer. Will be called recursively to add all
 * possible sub-routes.
 *
 * @param {String} path
 * @param {Object} config
 * @param {Array} segments
 */

p._addRoute = function (path, config, segments) {
  segments.push({
    path: path,
    handler: config
  })
  this._recognizer.add(segments)
  if (config.subRoutes) {
    for (var subPath in config.subRoutes) {
      // recursively walk all sub routes
      this._addRoute(
        subPath,
        config.subRoutes[subPath],
        // pass a copy in recursion to avoid mutating
        // across branches
        segments.slice()
      )
    }
  }
}

/**
 * Match a URL path and set the route context on vm,
 * triggering view updates.
 *
 * @param {String} path
 */

p._match = function (path) {
  if (path === this._currentPath) {
    return
  }
  this._currentPath = path
  // normalize against root
  if (
    this._pushstate &&
    this._root &&
    path.indexOf(this._root) === 0
  ) {
    path = path.slice(this._root.length)
  }
  var matched = this._recognizer.recognize(path)
  // aggregate params
  var params
  if (matched) {
    params = [].reduce.call(matched, function (prev, cur) {
      if (cur.params) {
        for (var key in cur.params) {
          prev[key] = cur.params[key]
        }
      }
      return prev
    }, {})
  }
  // construct route context
  var context = {
    path: path,
    params: params,
    query: matched && matched.queryParams,
    _matched: matched || this._notfoundHandler,
    _matchedCount: 0,
    _router: this
  }
  if (!this.app) {
    this.app = new this._appConstructor({
      el: this._appContainer,
      data: {
        route: context
      }
    })
  } else {
    this.app.route = context
  }
}

/**
 * Set current hash
 *
 * @param {String} hash
 * @param {Boolean} replace
 */

function setHash (hash, replace) {
  if (replace) {
    var urlLength = location.href.length - location.hash.length
    var fullURL = location.href.slice(0, urlLength) + '#' + hash
    location.replace(fullURL)
  } else {
    location.hash = hash
  }
}

/**
 * Warning (check console for IE9)
 *
 * @param {String} msg
 */

function warn (msg) {
  if (typeof console !== 'undefined') {
    console.warn(msg)
  }
}

module.exports = VueRouter