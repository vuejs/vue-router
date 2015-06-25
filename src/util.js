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
