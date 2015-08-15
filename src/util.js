var RouteRecognizer = require('route-recognizer')
var genQuery = RouteRecognizer.prototype.generateQueryString

/**
 * Warn stuff.
 *
 * @param {String} msg
 * @param {Error} [err]
 */

exports.warn = function (msg, err) {
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

exports.resolvePath = function (base, relative) {
  var query = base.match(/(\?.*)$/)
  if (query) {
    query = query[1]
    base = base.slice(0, -query.length)
  }
  // a query!
  if (relative.charAt(0) === '?') {
    return base + relative
  }
  var stack = base.split('/')
  // remove trailing segment
  stack.pop()
  // resolve relative path
  var segments = relative.split('/')
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i]
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

exports.isPromise = function (p) {
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

exports.getRouteConfig = function (component, name) {
  var options =
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

var resolver
exports.resolveAsyncComponent = function (handler, cb) {
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

exports.mapParams = function (path, params, query) {
  for (var key in params) {
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
  var regex = new RegExp(':' + key + '(\\/|$)')
  var value = params[key]
  return path.replace(regex, function (m) {
    return m.charAt(m.length - 1) === '/'
      ? value + '/'
      : value
  })
}
