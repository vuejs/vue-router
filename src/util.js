/**
 * Warn stuff.
 *
 * @param {String} msg
 * @param {Error} [err]
 */

exports.warn = function (msg, err) {
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
 * Call an async hook function with a list of arguments,
 * plus a pair of resolve and reject functions. If the hook
 * returns a promise, or returns a boolean, the resolve and
 * reject functions will be handled accordingly.
 *
 * @param {Function} fn
 * @param {Object} options
 *                 - {Array} [args]
 *                 - {Function} onResolve
 *                 - {Function} onReject
 */

exports.callAsyncFn = function (fn, options) {
  var args = options.args || []
  var onResolve = options.onResolve
  var onReject = options.onReject
  args.push(onResolve, onReject)
  var res = fn.apply(null, args)
  if (exports.isPromise(res)) {
    res.then(onResolve, onReject)
  } else if (res === true) {
    onResolve()
  } else if (res === false) {
    onReject()
  }
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
