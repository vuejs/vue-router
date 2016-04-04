import RouteRecognizer from '../lib/route-recognizer'
import util, { warn, mapParams } from './util'
import applyOverride from './override'
import Route from './route'
import Transition from './transition'
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

// late bind during install
let Vue

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
    this._children = []

    // route recognizer
    this._recognizer = new RouteRecognizer()
    this._guardRecognizer = new RouteRecognizer()

    // state
    this._started = false
    this._startCb = null
    this._currentRoute = {}
    this._currentTransition = null
    this._previousTransition = null
    this._notFoundHandler = null
    this._notFoundRedirect = null
    this._beforeEachHooks = []
    this._afterEachHooks = []

    // trigger transition on initial render?
    this._rendered = false
    this._transitionOnLoad = transitionOnLoad

    // history mode
    this._root = root
    this._abstract = abstract
    this._hashbang = hashbang

    // check if HTML5 history is available
    const hasPushState =
      typeof window !== 'undefined' &&
      window.history &&
      window.history.pushState
    this._history = history && hasPushState
    this._historyFallback = history && !hasPushState

    // create history object
    const inBrowser = Vue.util.inBrowser
    this.mode = (!inBrowser || this._abstract)
      ? 'abstract'
      : this._history
        ? 'html5'
        : 'hash'

    const History = historyBackends[this.mode]
    this.history = new History({
      root: root,
      hashbang: this._hashbang,
      onChange: (path, state, anchor) => {
        this._match(path, state, anchor)
      }
    })

    // other options
    this._saveScrollPosition = saveScrollPosition
    this._linkActiveClass = linkActiveClass
    this._suppress = suppressTransitionError
  }

  // API ===================================================

    /**
   * Register a map of top-level paths.
   *
   * @param {Object} map
   */

  map (map) {
    for (let route in map) {
      this.on(route, map[route])
    }
    return this
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

  on (rootPath, handler) {
    if (rootPath === '*') {
      this._notFound(handler)
    } else {
      this._addRoute(rootPath, handler, [])
    }
    return this
  }

  /**
   * Set redirects.
   *
   * @param {Object} map
   */

  redirect (map) {
    for (let path in map) {
      this._addRedirect(path, map[path])
    }
    return this
  }

  /**
   * Set aliases.
   *
   * @param {Object} map
   */

  alias (map) {
    for (let path in map) {
      this._addAlias(path, map[path])
    }
    return this
  }

  /**
   * Set global before hook.
   *
   * @param {Function} fn
   */

  beforeEach (fn) {
    this._beforeEachHooks.push(fn)
    return this
  }

  /**
   * Set global after hook.
   *
   * @param {Function} fn
   */

  afterEach (fn) {
    this._afterEachHooks.push(fn)
    return this
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

  go (path) {
    let replace = false
    let append = false
    if (Vue.util.isObject(path)) {
      replace = path.replace
      append = path.append
    }
    path = this.stringifyPath(path)
    if (path) {
      this.history.go(path, replace, append)
    }
  }

  /**
   * Short hand for replacing current path
   *
   * @param {String} path
   */

  replace (path) {
    if (typeof path === 'string') {
      path = { path }
    }
    path.replace = true
    this.go(path)
  }

  /**
   * Start the router.
   *
   * @param {VueConstructor} App
   * @param {String|Element} container
   * @param {Function} [cb]
   */

  start (App, container, cb) {
    /* istanbul ignore if */
    if (this._started) {
      warn('already started.')
      return
    }
    this._started = true
    this._startCb = cb
    if (!this.app) {
      /* istanbul ignore if */
      if (!App || !container) {
        throw new Error(
          'Must start vue-router with a component and a ' +
          'root container.'
        )
      }
      /* istanbul ignore if */
      if (App instanceof Vue) {
        throw new Error(
          'Must start vue-router with a component, not a ' +
          'Vue instance.'
        )
      }
      this._appContainer = container
      const Ctor = this._appConstructor = typeof App === 'function'
        ? App
        : Vue.extend(App)
      // give it a name for better debugging
      Ctor.options.name = Ctor.options.name || 'RouterApp'
    }

    // handle history fallback in browsers that do not
    // support HTML5 history API
    if (this._historyFallback) {
      const location = window.location
      const history = new HTML5History({ root: this._root })
      const path = history.root
        ? location.pathname.replace(history.rootRE, '')
        : location.pathname
      if (path && path !== '/') {
        location.assign(
          (history.root || '') + '/' +
          this.history.formatPath(path) +
          location.search
        )
        return
      }
    }

    this.history.start()
  }

  /**
   * Stop listening to route changes.
   */

  stop () {
    this.history.stop()
    this._started = false
  }

  /**
   * Normalize named route object / string paths into
   * a string.
   *
   * @param {Object|String|Number} path
   * @return {String}
   */

  stringifyPath (path) {
    let generatedPath = ''
    if (path && typeof path === 'object') {
      if (path.name) {
        const extend = Vue.util.extend
        const currentParams =
          this._currentTransition &&
          this._currentTransition.to.params
        const targetParams = path.params || {}
        const params = currentParams
          ? extend(extend({}, currentParams), targetParams)
          : targetParams
        generatedPath = encodeURI(this._recognizer.generate(path.name, params))
      } else if (path.path) {
        generatedPath = encodeURI(path.path)
      }
      if (path.query) {
        // note: the generated query string is pre-URL-encoded by the recognizer
        const query = this._recognizer.generateQueryString(path.query)
        if (generatedPath.indexOf('?') > -1) {
          generatedPath += '&' + query.slice(1)
        } else {
          generatedPath += query
        }
      }
    } else {
      generatedPath = encodeURI(path ? path + '' : '')
    }
    return generatedPath
  }

  // Internal methods ======================================

    /**
   * Add a route containing a list of segments to the internal
   * route recognizer. Will be called recursively to add all
   * possible sub-routes.
   *
   * @param {String} path
   * @param {Object} handler
   * @param {Array} segments
   */

  _addRoute (path, handler, segments) {
    guardComponent(path, handler)
    handler.path = path
    handler.fullPath = (segments.reduce((path, segment) => {
      return path + segment.path
    }, '') + path).replace('//', '/')
    segments.push({
      path: path,
      handler: handler
    })
    this._recognizer.add(segments, {
      as: handler.name
    })
    // add sub routes
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

  _notFound (handler) {
    guardComponent('*', handler)
    this._notFoundHandler = [{ handler: handler }]
  }

  /**
   * Add a redirect record.
   *
   * @param {String} path
   * @param {String} redirectPath
   */

  _addRedirect (path, redirectPath) {
    if (path === '*') {
      this._notFoundRedirect = redirectPath
    } else {
      this._addGuard(path, redirectPath, this.replace)
    }
  }

  /**
   * Add an alias record.
   *
   * @param {String} path
   * @param {String} aliasPath
   */

  _addAlias (path, aliasPath) {
    this._addGuard(path, aliasPath, this._match)
  }

  /**
   * Add a path guard.
   *
   * @param {String} path
   * @param {String} mappedPath
   * @param {Function} handler
   */

  _addGuard (path, mappedPath, handler) {
    this._guardRecognizer.add([{
      path: path,
      handler: (match, query) => {
        const realPath = mapParams(
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

  _checkGuard (path) {
    let matched = this._guardRecognizer.recognize(path, true)
    if (matched) {
      matched[0].handler(matched[0], matched.queryParams)
      return true
    } else if (this._notFoundRedirect) {
      matched = this._recognizer.recognize(path)
      if (!matched) {
        this.replace(this._notFoundRedirect)
        return true
      }
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

  _match (path, state, anchor) {
    if (this._checkGuard(path)) {
      return
    }

    const currentRoute = this._currentRoute
    const currentTransition = this._currentTransition

    if (currentTransition) {
      if (currentTransition.to.path === path) {
        // do nothing if we have an active transition going to the same path
        return
      } else if (currentRoute.path === path) {
        // We are going to the same path, but we also have an ongoing but
        // not-yet-validated transition. Abort that transition and reset to
        // prev transition.
        currentTransition.aborted = true
        this._currentTransition = this._prevTransition
        return
      } else {
        // going to a totally different path. abort ongoing transition.
        currentTransition.aborted = true
      }
    }

    // construct new route and transition context
    const route = new Route(path, this)
    const transition = new Transition(this, route, currentRoute)

    // current transition is updated right now.
    // however, current route will only be updated after the transition has
    // been validated.
    this._prevTransition = currentTransition
    this._currentTransition = transition

    if (!this.app) {
      // initial render
      const router = this
      this.app = new this._appConstructor({
        el: this._appContainer,
        created () {
          this.$router = router
        },
        _meta: {
          $route: route
        }
      })
    }

    // check global before hook
    const beforeHooks = this._beforeEachHooks
    const startTransition = () => {
      transition.start(() => {
        this._postTransition(route, state, anchor)
      })
    }

    if (beforeHooks.length) {
      transition.runQueue(beforeHooks, (hook, _, next) => {
        if (transition === this._currentTransition) {
          transition.callHook(hook, null, next, {
            expectBoolean: true
          })
        }
      }, startTransition)
    } else {
      startTransition()
    }

    if (!this._rendered && this._startCb) {
      this._startCb.call(null)
    }

    // HACK:
    // set rendered to true after the transition start, so
    // that components that are acitvated synchronously know
    // whether it is the initial render.
    this._rendered = true
  }

  /**
   * Set current to the new transition.
   * This is called by the transition object when the
   * validation of a route has succeeded.
   *
   * @param {Transition} transition
   */

  _onTransitionValidated (transition) {
    // set current route
    const route = this._currentRoute = transition.to
    // update route context for all children
    if (this.app.$route !== route) {
      this.app.$route = route
      this._children.forEach((child) => {
        child.$route = route
      })
    }
    // call global after hook
    if (this._afterEachHooks.length) {
      this._afterEachHooks.forEach(hook => hook.call(null, {
        to: transition.to,
        from: transition.from
      }))
    }
    this._currentTransition.done = true
  }

  /**
   * Handle stuff after the transition.
   *
   * @param {Route} route
   * @param {Object} [state]
   * @param {String} [anchor]
   */

  _postTransition (route, state, anchor) {
    // handle scroll positions
    // saved scroll positions take priority
    // then we check if the path has an anchor
    const pos = state && state.pos
    if (pos && this._saveScrollPosition) {
      Vue.nextTick(() => {
        window.scrollTo(pos.x, pos.y)
      })
    } else if (anchor) {
      Vue.nextTick(() => {
        const el = document.getElementById(anchor.slice(1))
        if (el) {
          window.scrollTo(window.scrollX, el.offsetTop)
        }
      })
    }
  }
}

/**
 * Allow directly passing components to a route
 * definition.
 *
 * @param {String} path
 * @param {Object} handler
 */

function guardComponent (path, handler) {
  let comp = handler.component
  if (Vue.util.isPlainObject(comp)) {
    comp = handler.component = Vue.extend(comp)
  }
  /* istanbul ignore if */
  if (typeof comp !== 'function') {
    handler.component = null
    warn(
      'invalid component for route "' + path + '".'
    )
  }
}

/* Installation */

Router.installed = false

/**
 * Installation interface.
 * Install the necessary directives.
 */

Router.install = function (externalVue) {
  /* istanbul ignore if */
  if (Router.installed) {
    warn('already installed.')
    return
  }
  Vue = externalVue
  applyOverride(Vue)
  View(Vue)
  Link(Vue)
  util.Vue = Vue
  Router.installed = true
}

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Router)
}

export default Router
