var routerUtil = require('./util')

module.exports = function (Vue, Router) {

  var p = Router.prototype

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
   * @param {Object} handler
   *                 - {String} component
   *                 - {Object} [subRoutes]
   *                 - {Boolean} [forceRefresh]
   *                 - {Function} [before]
   *                 - {Function} [after]
   */

  p.on = function (rootPath, handler) {
    if (rootPath === '*') {
      this._notFound(handler)
    } else {
      this._addRoute(rootPath, handler, [])
    }
  }

  /**
   * Set redirects.
   *
   * @param {Object} map
   */

  p.redirect = function (map) {
    for (var path in map) {
      this._addRedirect(path, map[path])
    }
  }

  /**
   * Set aliases.
   *
   * @param {Object} map
   */

  p.alias = function (map) {
    for (var path in map) {
      this._addAlias(path, map[path])
    }
  }

  /**
   * Set global before hook.
   *
   * @param {Function} fn
   */

  p.beforeEach = function (fn) {
    this._beforeEachHook = fn
  }

  /**
   * Set global after hook.
   *
   * @param {Function} fn
   */

  p.afterEach = function (fn) {
    this._afterEachHook = fn  
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
    var url
    if (this._hasPushState) {
      if (this._history) {
        path = url = this._formatPath(path)
      } else {
        url = this._formatHashPath(path)
        path = url.replace(/^#!?/, '')
      }
      if (replace) {
        history.replaceState({}, '', url)
      } else {
        // record scroll position
        var pos = {
          x: window.pageXOffset,
          y: window.pageYOffset
        }
        history.replaceState({ pos: pos }, '', location.href)
        // actually push new state
        history.pushState({}, '', url)
      }
      this._match(path)
    } else {
      // just set hash
      routerUtil.setHash(this._formatHashPath(path), replace)
    }
  }

  /**
   * Short hand for replacing current path
   *
   * @param {String} path
   */

  p.replace = function (path) {
    this.go(path, {
      replace: true
    })
  }

  /**
   * Start the router.
   *
   * @param {VueConstructor} App
   * @param {String|Element} container
   */

  p.start = function (App, container) {
    if (this._started) {
      routerUtil.warn('already started.')
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
    if (this._hasPushState) {
      this._initHistoryMode()
    } else {
      this._initHashMode()
    }
  }

  /**
   * Stop listening to route changes.
   */

  p.stop = function () {
    var event = this._history
      ? 'popstate'
      : 'hashchange'
    window.removeEventListener(event, this._onRouteChange)
    this._started = false
  }
}
