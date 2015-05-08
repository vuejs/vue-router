var Recognizer = require('route-recognizer')
var hasPushState = history && history.pushState

/**
 * Router constructor
 *
 * @param {Object} [options]
 *                 - {Boolean} hashbang  (default: true)
 *                 - {Boolean} pushstate (default: false)
 */
function VueRouter (options) {
  this._recognizer = new Recognizer()
  this._root = null
  this._currentPath = null
  this._notfoundHandler = null
  this._hashbang = !(options && options.hashbang === false)
  this._pushstate = !!(hasPushState && options && options.pushstate)
}

var p = VueRouter.prototype

//
// Public API
//

/**
 * Register a root-level path
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
  this._addRoute(rootPath, config, [])
}

p.notfound = function (handler) {
  this._notfoundHandler = [{ handler: handler }]
}

p.redirect = function (map) {
  // TODO
  // use another recognizer to recognize redirects
}

p.go = function (path) {
  if (this._pushstate) {

  } else {
    location.hash = this._hashbang
      ? '!' + path
      : path
  }
}

p.back = function () {
  
}

/**
 * Initiate the router.
 *
 * @param {Vue} root
 */
p.init = function (root) {
  if (this._root) {
    console.warn('[vue-router] cannot init twice.')
    return
  }
  this._root = root
  if (this._pushstate) {
    this.initHistoryMode()
  } else {
    this.initHashMode()
  }
}

p.initHashMode = function () {
  var self = this
  function onHashChange () {
    // format hashbang
    if (
      self._hashbang &&
      location.hash &&
      location.hash.charAt(1) !== '!'
    ) {
      location.hash = '!' + location.hash.slice(1)
      return
    }
    var hash = location.hash.replace(/^#!?/, '')
    var url = hash + location.search
    self._match(url)
  }
  window.addEventListener('hashchange', onHashChange)
  onHashChange()
}

p.initHistoryMode = function () {
  var self = this
  function onPopState () {
    // TODO
    // self._match(url)
  }
  window.addEventListener('popstate', onPopState)
  onPopState()
}

p.stop = function () {

}

//
// Private Methods
//

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
 * Match a URL path and set the route context on root,
 * triggering view updates.
 *
 * @param {String} path
 */
p._match = function (path) {
  if (path === this._currentPath) {
    return
  }
  this._currentPath = path
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
  this._root.$set('route', context)
}

VueRouter.install = function (Vue) {
  require('./view')(Vue)
  require('./link')(Vue)
}

module.exports = VueRouter