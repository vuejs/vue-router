import RouteRecognizer from 'route-recognizer'
const genQuery = RouteRecognizer.prototype.generateQueryString

// export default for holding the Vue reference
const exports = {}
export default exports

/**
 * Warn stuff.
 *
 * @param {String} msg
 * @param {Error} [err]
 */

export function warn (msg, err) {
  /* istanbul ignore next */
  if (window.console) {
    console.warn('[vue-router] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

/**
 * Resolve a relative path.
 *
 * @param {String} base
 * @param {String} relative
 * @return {String}
 */

export function resolvePath (base, relative) {
  let query = base.match(/(\?.*)$/)
  if (query) {
    query = query[1]
    base = base.slice(0, -query.length)
  }
  // a query!
  if (relative.charAt(0) === '?') {
    return base + relative
  }
  let stack = base.split('/')
  // remove trailing segment
  stack.pop()
  // resolve relative path
  let segments = relative.split('/')
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
  let options =
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

export function mapParams (path, params, query) {
  for (let key in params) {
    path = replaceParam(path, params, key)
  }
  if (query) {
    path += genQuery(query)
  }
  return path
}

/**
 * Replace a param segment with real value in a matched
 * path.
 *
 * @param {String} path
 * @param {Object} params
 * @param {String} key
 * @return {String}
 */

function replaceParam (path, params, key) {
  let regex = new RegExp(':' + key + '(\\/|$)')
  let value = params[key]
  return path.replace(regex, m =>
    m.charAt(m.length - 1) === '/'
      ? value + '/'
      : value
  )
}
