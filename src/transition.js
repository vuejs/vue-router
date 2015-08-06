var util = require('./util')

/**
 * A RouteTransition object represents the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * @param {Route} route
 * @param {Route} previousRoute
 */

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

/**
 * Abort an ongoing transition and return to previous
 * location.
 */

p.abort = function () {
  this.to._aborted = true
  this.to._router.replace(this.from.path || '/')
}

/**
 * Abort the current transition and redirect to a new one.
 */

p.redirect = function () {
  // TODO
}

/**
 * Determine the reusability of a from component.
 *
 * @param {Vue} component
 * @return {Boolean}
 */

p._resolveReusability = function (component) {
  var canReuseFn = util.getRouteConfig(component, 'canReuse')
  var canReuse = typeof canReuseFn === 'boolean'
    ? canReuseFn
    : canReuseFn
      ? canReuseFn.call(component, this)
      : true // defaults to true
  this._canReuse = canReuse
  this._Component = component && canReuse
    ? component.constructor
    : null
  return canReuse
}

/**
 * Resolve the router-view component to render based on
 * the owner of the current transition.
 * Sets this._componentID and returns the value.
 *
 * @param {Vue} ownerComponent
 * @return {String|null}
 */

p._resolveComponentID = function (ownerComponent) {
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

/**
 * Call a user provided route transition hook and handle
 * the response (e.g. if the user returns a promise).
 *
 * @param {Function} hook
 * @param {Vue} [component]
 * @param {Function} [cb]
 * @param {Boolean} [expectBoolean]
 */

p._callHook = function (hook, component, cb, expectBoolean) {
  var transition = this
  var abort = function () {
    transition.abort()
  }
  var next = transition.next = function () {
    if (!cb || transition.to._aborted) {
      return
    }
    cb.apply(null, arguments)
  }
  var res = hook.call(component, transition)
  var promise = util.isPromise(res)
  if (expectBoolean) {
    if (typeof res === 'boolean') {
      res ? next() : abort()
    } else if (promise) {
      res.then(function (ok) {
        ok ? next() : abort()
      }, abort)
    }
  } else if (promise) {
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
