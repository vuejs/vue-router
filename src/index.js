var Recognizer = require('route-recognizer')
var location = window.location

/**
 * Router constructor
 */
function VueRouter (options) {
  this._recognizer = new Recognizer()
  this._root = null
  this._hashbang = options && !!options.hashbang
  this._history = options && !!options.html5history
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

p.notfound = function () {

}

p.redirect = function () {
  
}

p.go = function (path) {
  if (this._history) {

  } else {
    window.location.hash = this._hashbang
      ? '!' + path
      : path
  }
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
  if (this._history) {
    this.initHistoryMode()
  } else {
    this.initHashMode()
  }
}

p.initHashMode = function () {
  var self = this
  function onHashChange () {
    var hash = location.hash.replace(/^#!?/, '')
    var url = hash + location.search
    self._match(url)
  }
  window.addEventListener('hashchange', onHashChange)
  onHashChange()
}

p.initHistoryMode = function () {

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
 * Match a URL path and set the routeContext on root,
 * triggering view updates.
 *
 * @param {String} path
 */
p._match = function (path) {
  var matched = this._recognizer.recognize(path)
  var context = {
    _path: path,
    _matched: matched,
    _matchedCount: 0,
    _router: this
  }
  this._root.$set('routeContext', context)
}

VueRouter.install = function (Vue) {
  require('./view')(Vue)
  require('./link')(Vue)
}

module.exports = VueRouter