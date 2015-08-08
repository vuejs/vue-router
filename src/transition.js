var util = require('./util')
var pipeline = require('./pipeline')

/**
 * A Transition object manages the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * @param {Router} router
 * @param {Route} to
 * @param {Route} from
 */

function Transition (router, to, from) {
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

  // the activate queue is an array of route handlers
  // that need to be activated
  this._activateQueue = matched.map(function (match) {
    return match.handler
  })
}

var p = Transition.prototype

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
 * chain [Component A, Component C]:
 *
 *  A    A
 *  | => |
 *  B    C
 *
 * 1. Reusablity phase:
 *   -> canReuse(A, A)
 *   -> canReuse(B, C)
 *   -> determine new queues:
 *      - deactivation: [B]
 *      - activation: [C]
 *
 * 2. Validation phase:
 *   -> canDeactivate(B)
 *   -> canActivate(C)
 *
 * 3. Activation phase:
 *   -> deactivate(B)
 *   -> activate(C)
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
  var rdaq = daq.slice().reverse()
  var reuseQueue

  // check reusability
  for (var i = 0; i < rdaq.length; i++) {
    if (!pipeline.canReuse(transition, rdaq[i], aq[i])) {
      break
    }
  }
  if (i > 0) {
    reuseQueue = daq.slice(i)
    daq = daq.slice(daq.length - i)
    aq = aq.slice(i)
  }

  transition._runQueue(daq, pipeline.canDeactivate, function () {
    transition._runQueue(aq, pipeline.canActivate, function () {
      transition._runQueue(daq, pipeline.deactivate, function () {
        reuseQueue && reuseQueue.forEach(function (view) {
          view.reuse()
        })
        // the activation is handled by updating the $route
        // context and creating new <router-view> instances.
        cb()
      })
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

module.exports = Transition
