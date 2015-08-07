var util = require('./util')
var activate = require('./pipeline/activate')
var deactivate = require('./pipeline/deactivate')
var canActivate = require('./pipeline/can-activate')
var canDeactivate = require('./pipeline/can-deactivate')

/**
 * A RouteTransition object represents the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * @param {Router} router
 * @param {Route} to
 * @param {Route} from
 */

function RouteTransition (router, to, from) {
  // mark previous route as aborted
  if (from) {
    from._aborted = true
  }

  this.router = router
  this.to = to
  this.from = from

  // start by determine the queues

  // the deactivate queue is an array of router-view
  // directive instances that need to be deactivated,
  // deepest first.
  this.deactivateQueue = router._views

  // check the default handler of the deepest match
  var matched = [].slice.call(to._matched)
  var deepest = matched[matched.length - 1]
  if (deepest.handler.defaultChildHandler) {
    matched.push({
      handler: deepest.handler.defaultChildHandler
    })
  }

  // the activate queue is an array of component IDs
  // that need to be activated
  this.activateQueue = matched.map(function (match) {
    return match.handler.component
  })

  console.log(this.deactivateQueue)
  console.log(this.activateQueue)
}

var p = RouteTransition.prototype

/**
 * Progress to the next step in the transition pipeline.
 */

p.next = function () {
  if (this.to._aborted) {
    return
  }
}

/**
 * Abort current transition and return to previous location.
 */

p.abort = function () {
  this.to._aborted = true
  this.router.replace(this.from.path || '/')
}

/**
 * Abort current transition and redirect to a new location.
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
