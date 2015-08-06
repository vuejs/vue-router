var isPromise = require('../../util').isPromise

function RouteTransition (route, previousRoute) {
  this.to = route
  this.from = previousRoute
  this.next = null
  this._handler = null
  this._Component = null
  this._componentID = null
  this._canReuse = false
  // mark previous route as aborted
  this.from._aborted = true
}

var p = RouteTransition.prototype

p.abort = function () {
  this.to._aborted = true
  this.to._router.replace(this.from.path || '/')
}

p.resolveComponentID = function (ownerComponent) {
  var matched = this.to._matched
  if (!matched) {
    return null
  }
  var depth = getViewDepth(ownerComponent)
  var segment = matched[depth]
  if (!segment) {
    // check if the parent view has a default child view
    var parentSegment = matched[depth - 1]
    if (parentSegment && parentSegment.handler.defaultChildHandler) {
      this._componentID = parent.handler.defaultChildHandler.component
    }
  } else {
    this._componentID = segment.handler.component
  }
  return this._componentID
}

p.callHook = function (hook, component, cb, expectBoolean) {
  var transition = this
  var abort = transition.abort
  var next = transition.next = function () {
    if (!cb || transition.to._aborted) {
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

/**
 * Checked nested view depth of the current view.
 *
 * @param {Vue} vm
 * @return {Number}
 */

function getViewDepth (vm) {
  var depth = 0
  while (vm.$parent) {
    if (vm.$options._isRouterView) {
      depth++
    }
    vm = vm.$parent
  }
  return depth
}


module.exports = RouteTransition
