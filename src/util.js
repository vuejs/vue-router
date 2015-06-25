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
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

exports.isPromise = function (p) {
  return p &&
    typeof p.then === 'function' &&
    typeof p.catch === 'function'
}
