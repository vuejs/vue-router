import { warn, mapParams } from '../util'
import Route from '../route'
import RouteTransition from '../transition'

export default function (Vue, Router) {

  let _ = Vue.util

  /**
   * Add a route containing a list of segments to the internal
   * route recognizer. Will be called recursively to add all
   * possible sub-routes.
   *
   * @param {String} path
   * @param {Object} handler
   * @param {Array} segments
   */

  Router.prototype._addRoute = function (path, handler, segments) {
    guardComponent(handler)
    segments.push({
      path: path,
      handler: handler
    })
    this._recognizer.add(segments)
    if (handler.subRoutes) {
      for (let subPath in handler.subRoutes) {
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

  Router.prototype._notFound = function (handler) {
    guardComponent(handler)
    this._notFoundHandler = [{ handler: handler }]
  }

  /**
   * Add a redirect record.
   *
   * @param {String} path
   * @param {String} redirectPath
   */

  Router.prototype._addRedirect = function (path, redirectPath) {
    this._addGuard(path, redirectPath, this.replace)
  }

  /**
   * Add an alias record.
   *
   * @param {String} path
   * @param {String} aliasPath
   */

  Router.prototype._addAlias = function (path, aliasPath) {
    this._addGuard(path, aliasPath, this._match)
  }

  /**
   * Add a path guard.
   *
   * @param {String} path
   * @param {String} mappedPath
   * @param {Function} handler
   */

  Router.prototype._addGuard = function (path, mappedPath, handler) {
    this._guardRecognizer.add([{
      path: path,
      handler: (match, query) => {
        let realPath = mapParams(
          mappedPath,
          match.params,
          query
        )
        handler.call(this, realPath)
      }
    }])
  }

  /**
   * Check if a path matches any redirect records.
   *
   * @param {String} path
   * @return {Boolean} - if true, will skip normal match.
   */

  Router.prototype._checkGuard = function (path) {
    let matched = this._guardRecognizer.recognize(path)
    if (matched) {
      matched[0].handler(matched[0], matched.queryParams)
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

  Router.prototype._match = function (path, state, anchor) {
    if (this._checkGuard(path)) {
      return
    }

    let prevRoute = this._currentRoute
    let prevTransition = this._currentTransition

    // abort ongoing transition
    if (prevTransition && path !== prevTransition.to.path) {
      prevTransition.aborted = true
    }

    // do nothing if going to the same route.
    // the route only changes when a transition successfully
    // reaches activation; we don't need to do anything
    // if an ongoing transition is aborted during validation
    // phase.
    if (prevTransition && path === prevRoute.path) {
      return
    }

    // construct new route and transition context
    let route = new Route(path, this)
    let transition = this._currentTransition =
      new RouteTransition(this, route, prevRoute)

    if (!this.app) {
      // initial render
      this.app = new this._appConstructor({
        el: this._appContainer,
        _meta: {
          $route: route
        }
      })
    }

    // check global before hook
    let before = this._beforeEachHook
    let startTransition = () => {
      transition.start(() => {
        this._postTransition(route, state, anchor)
      })
    }

    if (before) {
      transition.callHook(before, null, startTransition, true)
    } else {
      startTransition()
    }

    // HACK:
    // set rendered to true after the transition start, so
    // that components that are acitvated synchronously know
    // whether it is the initial render.
    this._rendered = true
  }

  /**
   * Switch the current route to a new one.
   * This is called by the transition object when the
   * validation of a route has succeeded.
   *
   * @param {Route} route
   */

  Router.prototype._updateRoute = function (route) {
    this._currentRoute = route
    // update route context for all children
    if (this.app.$route !== route) {
      this.app.$route = route
      this._children.forEach((child) => {
        child.$route = route
      })
    }
  }

  /**
   * Handle stuff after the transition.
   *
   * @param {Route} route
   * @param {Object} [state]
   * @param {String} [anchor]
   */

  Router.prototype._postTransition = function (route, state, anchor) {
    // handle scroll positions
    // saved scroll positions take priority
    // then we check if the path has an anchor
    let pos = state && state.pos
    if (pos && this._saveScrollPosition) {
      Vue.nextTick(() => {
        window.scrollTo(pos.x, pos.y)
      })
    } else if (anchor) {
      Vue.nextTick(() => {
        let el = document.getElementById(anchor.slice(1))
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
    let comp = handler.component
    if (_.isPlainObject(comp)) {
      comp = handler.component = Vue.extend(comp)
    }
    /* istanbul ignore if */
    if (typeof comp !== 'function') {
      handler.component = null
      warn(
        'invalid component for route "' + handler.path + '"'
      )
    }
  }
}
