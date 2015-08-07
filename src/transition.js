var util = require('./util')

/**
 * A RouteTransition object manages the pipeline of a
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
  // mark current route's owner
  to._ownerTransition = this

  this.router = router
  this.to = to
  this.from = from
  this.next = null

  // callback for the while pipeline
  this._cb = null
  this._done = false

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

  // the activate queue is an array of component
  // constructors OR async component factories
  // that need to be activated
  this._activateQueue = matched.map(function (match) {
    return match.handler.component
  })
}

var p = RouteTransition.prototype

// API -----------------------------------------------------

/**
 * Abort current transition and return to previous location.
 */

p.abort = function () {
  if (this._done) return
  this.to._aborted = true
  this.router.replace(this.from.path || '/')
  this._cb()
}

/**
 * Abort current transition and redirect to a new location.
 */

p.redirect = function () {
  // TODO
}

// Internal ------------------------------------------------

/**
 * Start the transition pipeline.
 *
 * @param {Function} cb
 */

p._start = function (cb) {
  var transition = this
  var done = transition._cb = function () {
    if (!transition._done) {
      cb()
      transition._done = true
    }
  }
  // check the global before hook
  var before = this.router._beforeEachHook
  if (before) {
    this._callHook(before, null, function () {
      transition._runPipeline(done)      
    }, true)
  } else {
    transition._runPipeline(done)
  }
}

/**
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
 * @param {Function} cb
 */

p._runPipeline = function (cb) {
  var transition = this
  var daq = this._deactivateQueue
  var aq = this._activateQueue
  transition._runQueue(daq, canDeactivate, function () {
    transition._runQueue(aq, canActivate, function () {
      transition._runQueue(daq, deactivate, cb)
      // the activation is handled by updating the $route
      // context and creating new <router-view> instances.
    })
  })
}

/**
 * Asynchronously and sequentially apply a function to a
 * queue.
 *
 * @param {Array} queue
 * @param {Function} fn
 * @param {Function} cb
 */

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
 * Call a user provided route transition hook and handle
 * the response (e.g. if the user returns a promise).
 *
 * @param {Function} hook
 * @param {*} [context]
 * @param {Function} [cb]
 * @param {Boolean} [expectBoolean]
 */

p._callHook = function (hook, context, cb, expectBoolean) {
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
  var res = hook.call(context, transition)
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

// Pipeline ------------------------------------------------

/**
 * Check if a component can deactivate.
 *
 * @param {Transition} transition
 * @param {Directive} view
 * @param {Function} next
 */

function canDeactivate (transition, view, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next, true)
  }
}

/**
 * Check if a component can activate.
 *
 * @param {Transition} transition
 * @param {Function} Component
 * @param {Function} next
 */

function canActivate (transition, Component, next) {
  util.resolveAsyncComponent(Component, function (Component) {
    // have to check due to async-ness
    if (transition.to._aborted) {
      return
    }
    // determine if this component can be activated
    var hook = util.getRouteConfig(Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition._callHook(hook, null, next, true)
    }
  })
}

/**
 * Call deactivate hooks for existing router-views.
 *
 * @param {Transition} transition
 * @param {Directive} view
 * @param {Function} next
 */

function deactivate (transition, view, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next)
  }
}

module.exports = RouteTransition
