import { warn } from '../util'

export default function (Vue, Router) {

  /**
   * Register a map of top-level paths.
   *
   * @param {Object} map
   */

  Router.prototype.map = function (map) {
    for (let route in map) {
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

  Router.prototype.on = function (rootPath, handler) {
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

  Router.prototype.redirect = function (map) {
    for (let path in map) {
      this._addRedirect(path, map[path])
    }
  }

  /**
   * Set aliases.
   *
   * @param {Object} map
   */

  Router.prototype.alias = function (map) {
    for (let path in map) {
      this._addAlias(path, map[path])
    }
  }

  /**
   * Set global before hook.
   *
   * @param {Function} fn
   */

  Router.prototype.beforeEach = function (fn) {
    this._beforeEachHooks.push(fn)
  }

  /**
   * Set global after hook.
   *
   * @param {Function} fn
   */

  Router.prototype.afterEach = function (fn) {
    this._afterEachHooks.push(fn)
  }

  /**
   * Navigate to a given path.
   * The path can be an object describing a named path in
   * the format of { name: '...', params: {}, query: {}}
   * The path is assumed to be already decoded, and will
   * be resolved against root (if provided)
   *
   * @param {String|Object} path
   * @param {Boolean} [replace]
   */

  Router.prototype.go = function (path, replace) {
    // handle named routes
    if (typeof path === 'object') {
      if (path.name) {
        var params = path.params || {}
        if (path.query) {
          params.queryParams = path.query
        }
        path = this._recognizer.generate(path.name, params)
      } else if (path.path) {
        path = path.path
      }
    }
    this.history.go(path + '', replace)
  }

  /**
   * Short hand for replacing current path
   *
   * @param {String} path
   */

  Router.prototype.replace = function (path) {
    this.go(path, true)
  }

  /**
   * Start the router.
   *
   * @param {VueConstructor} App
   * @param {String|Element} container
   */

  Router.prototype.start = function (App, container) {
    /* istanbul ignore if */
    if (this._started) {
      warn('already started.')
      return
    }
    this._started = true
    if (!this.app) {
      /* istanbul ignore if */
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
    this.history.start()
  }

  /**
   * Stop listening to route changes.
   */

  Router.prototype.stop = function () {
    this.history.stop()
    this._started = false
  }
}
