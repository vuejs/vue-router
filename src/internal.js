var routerUtil = require('./util')
var Route = require('./route')

module.exports = function (Vue, Router) {

  var p = Router.prototype

  /**
   * Initialize HTML5 history mode.
   */

  p._initHistoryMode = function () {
    var self = this
    this._onRouteChange = function (e) {
      var url = location.pathname + location.search
      if (self._history) {
        url = decodeURI(url)
        // respet base tag
        var base = document.querySelector('base')
        if (base) {
          url = url.replace(base.getAttribute('href'), '')
        }
        self._match(url)
      } else {
        // delegate hashbang formatting to router.go
        self.replace(decodeURI(location.hash))
      }
      // restore scroll position if saved
      var pos = e && e.state && e.state.pos
      if (pos && self._saveScrollPosition) {
        Vue.nextTick(function () {
          window.scrollTo(pos.x, pos.y)
        })
      }
    }
    window.addEventListener('popstate', this._onRouteChange)
    this._onRouteChange()
  }

  /**
   * Initialize hash mode.
   */

  p._initHashMode = function () {
    var self = this
    this._onRouteChange = function () {
      var path = location.hash.replace(/^#!?/, '')
      // format hash: add leading slash and hashbang
      var formattedHash = path
      if (formattedHash.charAt(0) !== '/') {
        formattedHash = '/' + formattedHash
      }
      if (self._hashbang) {
        formattedHash = '!' + formattedHash
      }
      // replace hash if formatted
      if (formattedHash !== location.hash.slice(1)) {
        routerUtil.setHash(formattedHash)
        return
      }
      var url = path + location.search
      url = decodeURI(url)
      self._match(url)
    }
    window.addEventListener('hashchange', this._onRouteChange)
    this._onRouteChange()
  }

  /**
   * Add a route containing a list of segments to the internal
   * route recognizer. Will be called recursively to add all
   * possible sub-routes.
   *
   * @param {String} path
   * @param {Object} handler
   * @param {Array} segments
   */

  p._addRoute = function (path, handler, segments) {
    guardComponent(handler)
    segments.push({
      path: path,
      handler: handler
    })
    this._recognizer.add(segments)
    if (handler.subRoutes) {
      for (var subPath in handler.subRoutes) {
        // default handler
        if (subPath === '*') {
          var child = handler.subRoutes[subPath]
          guardComponent(child)
          handler.defaultChildHandler = child
          continue
        }
        // recursively walk all sub routes
        this._addRoute(
          subPath,
          handler.subRoutes[subPath],
          // pass a copy in recursion to avoid mutating
          // across branches
          segments.slice()
        )
      }
    }
  }

  /**
   * Set the notFound route handler.
   *
   * @param {Object} handler
   */

  p._notFound = function (handler) {
    guardComponent(handler)
    this._notFoundHandler = [{ handler: handler }]
  }

  /**
   * Add a redirect record.
   *
   * @param {String} path
   * @param {String} redirectPath
   */

  p._addRedirect = function (path, redirectPath) {
    this._addGuard(path, redirectPath, this.replace)
  }

  /**
   * Add an alias record.
   *
   * @param {String} path
   * @param {String} aliasPath
   */

  p._addAlias = function (path, aliasPath) {
    this._addGuard(path, aliasPath, this._match)
  }

  /**
   * Add a path guard.
   *
   * @param {String} path
   * @param {String} mappedPath
   * @param {Function} handler
   */

  p._addGuard = function (path, mappedPath, handler) {
    var router = this
    this._guardRecognizer.add([{
      path: path,
      handler: function (match) {
        var realPath = mappedPath
        if (match.isDynamic) {
          for (var key in match.params) {
            realPath = replaceParam(realPath, match, key)
          }
        }
        handler.call(router, realPath)
      }
    }])
  }

  /**
   * Replace a param segment with real value in a matched
   * path.
   *
   * @param {String} path
   * @param {Object} match
   * @param {String} key
   * @return {String}
   */

  function replaceParam (path, match, key) {
    var regex = new RegExp(':' + key + '(\\/|$)')
    var value = match.params[key]
    return path.replace(regex, function (m) {
      return m.charAt(m.length - 1) === '/'
        ? value + '/'
        : value
    })
  }

  /**
   * Check if a path matches any redirect records.
   *
   * @param {String} path
   * @return {Boolean} - if true, will skip normal match.
   */

  p._checkGuard = function (path) {
    var matched = this._guardRecognizer.recognize(path)
    if (matched) {
      matched[0].handler(matched[0])
      return true
    }
  }

  /**
   * Match a URL path and set the route context on vm,
   * triggering view updates.
   *
   * @param {String} path
   * @param {Object} [state]
   * @param {String} [anchor]
   */

  p._match = function (path, state, anchor) {
    var self = this

    if (this._checkGuard(path)) {
      return
    }

    var previousRoute = this._currentRoute
    if (this.app && path === previousRoute.path) {
      return
    }

    // normalize against root
    var root = this.history.root
    if (root && path.indexOf(root) === 0) {
      path = path.slice(root.length)
    }

    // construct route context
    var route = new Route(path, this)

    // initial render
    if (!this.app) {
      // initial render
      this.app = new this._appConstructor({
        el: this._appContainer,
        data: {
          route: route
        }
      })
    }

    // check gloal before hook
    var before = this._beforeEachHook
    var transition = function () {
      self._transition(route, previousRoute, state, anchor)
    }
    var reject = function () {
      self.replace(previousRoute.path)
    }
    if (before) {
      routerUtil.callAsyncFn(before, {
        args: [route, previousRoute],
        onResolve: transition,
        onReject: reject
      })
    } else {
      transition()
    }
  }

  /**
   * Perform a route transition after it is validated.
   *
   * @param {Route} route
   * @param {Route} previousRoute
   */

  p._transition = function (route, previousRoute, state, anchor) {

    // update route context for all children
    if (this.app.route !== route) {
      this.app.route = route
      this._children.forEach(function (child) {
        child.route = route
      })
    }

    // check global after hook
    if (this._afterEachHook) {
      this._afterEachHook.call(null, route, previousRoute)
    }

    this._currentRoute = route

    // handle scroll positions
    // saved scroll positions take priority
    // then we check if the path has an anchor
    var pos = state && state.pos
    if (pos && this._saveScrollPosition) {
      Vue.nextTick(function () {
        window.scrollTo(pos.x, pos.y)
      })
    } else if (anchor) {
      Vue.nextTick(function () {
        var el = document.querySelector(anchor)
        if (el) {
          window.scrollTo(window.scrollX, el.offsetTop)
        }
      })
    }
  }

  /**
   * Allow directly passing components to a route
   * definition.
   *
   * @param {Object} handler
   */

  function guardComponent (handler) {
    var comp = handler.component
    var type = typeof comp
    if (type !== 'string') {
      if (type !== 'function') {
        comp = Vue.extend(comp)
      }
      if (!comp.cid) {
        routerUtil.warn('invalid router component: ' + comp)
        handler.component = null
        return
      }
      // generate a unique id for the anonymous component
      // and register it globally
      var id = 'router-view-' + comp.cid
      if (!Vue.component(id)) {
        Vue.component(id, comp)
      }
      // overwrite the definition so we don't do this again
      handler.component = id
    }
  }
}
