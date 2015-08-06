var isPromise = require('../../util').isPromise

function RouteTransition (route, previousRoute) {
  this.to = route
  this.from = previousRoute
  this.next = null
  this._reuse = false
  this._aborted = false
  this._handler = null
  this._Component = null
  // mark previous route as aborted
  this.from._aborted = true
}

var p = RouteTransition.prototype

p.abort = function () {
  this.to._aborted = true
  this.to._router.replace(this.from.path || '/')
}

p.callHook = function (hook, component, cb, expectBoolean) {
  var transition = this
  var abort = transition.abort
  var next = transition.next = function () {
    if (transition.to._aborted) {
      return
    }
    cb.apply(null, arguments)
  }
  var res = hook.call(component, transition)
  var promise = isPromise(res)
  if (expectBoolean) {
    if (typeof res === 'boolean') {
      res ? next() : abort()
    } else if (promise) {
      res.then(function (ok) {
        ok ? next() : abort()
      }, abort)
    }
  } else if (isPromise(res)) {
    res.then(next, abort)
  }
}

module.exports = RouteTransition
