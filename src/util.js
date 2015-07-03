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
 * Set current hash
 *
 * @param {String} hash
 * @param {Boolean} replace
 */

exports.setHash = function (hash, replace) {
  if (replace) {
    var urlLength = location.href.length - location.hash.length
    var fullURL = location.href.slice(0, urlLength) + '#' + hash
    location.replace(fullURL)
  } else {
    location.hash = hash
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
  var stack = base.split('/')
  stack.pop()
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
  return '/' + stack.join('/')
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
  if (isPromise(res)) {
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

function isPromise (p) {
  return p &&
    typeof p.then === 'function'
}
