import RouteRecognizer from '../lib/route-recognizer'
const genQuery = RouteRecognizer.prototype.generateQueryString

// export default for holding the Vue reference
const exports = {}
export default exports

/**
 * Warn stuff.
 *
 * @param {String} msg
 */

export function warn (msg) {
  /* istanbul ignore next */
  if (typeof console !== 'undefined') {
    console.error('[vue-router] ' + msg)
  }
}

/**
 * Resolve a relative path.
 *
 * @param {String} base
 * @param {String} relative
 * @param {Boolean} append
 * @return {String}
 */

export function resolvePath (base, relative, append) {
  let query = base.match(/(\?.*)$/)
  if (query) {
    query = query[1]
    base = base.slice(0, -query.length)
  }
  // a query!
  if (relative.charAt(0) === '?') {
    return base + relative
  }
  const stack = base.split('/')
  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }
  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i]
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      stack.pop()
    } else {
      stack.push(segment)
    }
  }
  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }
  return stack.join('/')
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

export function isPromise (p) {
  return p &&
    typeof p.then === 'function'
}

/**
 * Retrive a route config field from a component instance
 * OR a component contructor.
 *
 * @param {Function|Vue} component
 * @param {String} name
 * @return {*}
 */

export function getRouteConfig (component, name) {
  const options =
    component &&
    (component.$options || component.options)
  return options &&
    options.route &&
    options.route[name]
}

/**
 * Resolve an async component factory. Have to do a dirty
 * mock here because of Vue core's internal API depends on
 * an ID check.
 *
 * @param {Object} handler
 * @param {Function} cb
 */

let resolver
export function resolveAsyncComponent (handler, cb) {
  if (!resolver) {
    resolver = {
      resolve: exports.Vue.prototype._resolveComponent,
      $options: {
        components: {
          _: handler.component
        }
      }
    }
  } else {
    resolver.$options.components._ = handler.component
  }
  resolver.resolve('_', function (Component) {
    handler.component = Component
    cb(Component)
  })
}

/**
 * Map the dynamic segments in a path to params.
 *
 * @param {String} path
 * @param {Object} params
 * @param {Object} query
 */

export function mapParams (path, params = {}, query) {
  path = path.replace(/:([^\/]+)/g, (_, key) => {
    const val = params[key]
    /* istanbul ignore if */
    if (!val) {
      warn(
        'param "' + key + '" not found when generating ' +
        'path for "' + path + '" with params ' + JSON.stringify(params)
      )
    }
    return val || ''
  })
  if (query) {
    path += genQuery(query)
  }
  return path
}
