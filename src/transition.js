var util = require('./util')
var activate = require('./pipeline/activate')
var deactivate = require('./pipeline/deactivate')
var canActivate = require('./pipeline/can-activate')
var canDeactivate = require('./pipeline/can-deactivate')

/**
 * A RouteTransition object manages the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * A router view transition's pipeline can be described as
 * follows, assuming we are transitioning from an existing
 * <router-view> chain [Component A, Component B] to a new
 * chain [Component C, Component D]:
 *
 *  A    C
 *  | => |
 *  B    D
 *
 * --- Validation phase ---
 *
 * -> B.canDeactivate
 * -> A.canDeactivate
 * -> C.canActivate
 * -> D.canActivate
 *
 * --- Activation phase ---
 *
 * -> B.deactivate
 * -> A.deactivate
 * -> C.activate
 * -> D.activate
 *
 * Each of these steps can be asynchronous, and any
 * step can potentially abort the transition.
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
  this.next = null

  // callback for the while pipeline
  this._cb = null

  // start by determine the queues

  // the deactivate queue is an array of router-view
  // directive instances that need to be deactivated,
  // deepest first.
  this._deactivateQueue = router._views

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
  this._activateQueue = matched.map(function (match) {
    return match.handler.component
  })
}

var p = RouteTransition.prototype

// --- API exposed to users ---

/**
 * Abort current transition and return to previous location.
 */

p.abort = function () {
  this.to._aborted = true
  this.router.replace(this.from.path || '/')
  if (this._cb) {
    this._cb()
  }
}

/**
 * Abort current transition and redirect to a new location.
 */

p.redirect = function () {
  // TODO
}

// --- Internal ---

p._start = function (cb) {
  var transition = this
  var daq = this._deactivateQueue
  var aq = this._activateQueue
  var done = transition._cb = function () {
    cb && cb()
    transition._cb = null
  }
  transition._runQueue(daq, canDeactivate, function () {
    transition._runQueue(aq, canActivate, function () {
      transition._runQueue(daq, deactivate, function () {
        transition._runQueue(aq, activate, done)
      })
    })
  })
}

p._runQueue = function (queue, fn, cb) {
  var transition = this
  step(0)
  function step (index) {
    if (index >= queue.length) {
      cb()
    } else {
      fn(transition, queue[index], function () {
        step(index + 1)
      })
    }
  }
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
