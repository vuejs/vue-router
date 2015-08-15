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
  this.router = router
  this.to = to
  this.from = from
  this.next = null
  this.aborted = false

  // start by determine the queues

  // the deactivate queue is an array of router-view
  // directive instances that need to be deactivated,
  // deepest first.
  this.deactivateQueue = router._views

  // check the default handler of the deepest match
  var matched = to._matched
    ? Array.prototype.slice.call(to._matched)
    : []
  var deepest = matched[matched.length - 1]
  if (deepest && deepest.handler.defaultChildHandler) {
    matched.push({
      handler: deepest.handler.defaultChildHandler
    })
  }

  // the activate queue is an array of route handlers
  // that need to be activated
  this.activateQueue = matched.map(function (match) {
    return match.handler
  })
}

var p = Transition.prototype

/**
 * Abort current transition and return to previous location.
 */

p.abort = function () {
  if (!this.aborted) {
    this.aborted = true
    this.router.replace(this.from.path || '/')
  }
}

/**
 * Abort current transition and redirect to a new location.
 *
 * @param {String} path
 */

p.redirect = function (path) {
  if (!this.aborted) {
    this.aborted = true
    path = util.mapParams(path, this.to.params, this.to.query)
    this.router.replace(path)
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

p.start = function (cb) {
  var transition = this
  var daq = this.deactivateQueue
  var aq = this.activateQueue
  var rdaq = daq.slice().reverse()
  var reuseQueue

  // check reusability
  for (var i = 0; i < rdaq.length; i++) {
    if (!pipeline.canReuse(rdaq[i], aq[i], transition)) {
      break
    }
  }
  if (i > 0) {
    reuseQueue = rdaq.slice(0, i)
    daq = rdaq.slice(i).reverse()
    aq = aq.slice(i)
  }

  transition.runQueue(daq, pipeline.canDeactivate, function canActivatePhase () {
    transition.runQueue(aq, pipeline.canActivate, function deactivatePhase () {
      transition.runQueue(daq, pipeline.deactivate, function activatePhase () {
        // Validation phase is now over! The new route is valid.

        // Update router current route
        transition.router._updateRoute(transition.to)

        // trigger reuse for all reused views
        reuseQueue && reuseQueue.forEach(function (view) {
          pipeline.reuse(view, transition)
        })

        // the root of the chain that needs to be replaced
        // is the top-most non-reusable view.
        if (daq.length) {
          var view = daq[daq.length - 1]
          var depth = reuseQueue ? reuseQueue.length : 0
          pipeline.activate(view, transition, depth, cb)
        } else {
          cb()
        }
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

p.runQueue = function (queue, fn, cb) {
  var transition = this
  step(0)
  function step (index) {
    if (index >= queue.length) {
      cb()
    } else {
      fn(queue[index], transition, function nextStep () {
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
 * @param {Function} [cleanup]
 */

p.callHook = function (hook, context, cb, expectBoolean, cleanup) {
  var transition = this
  var nextCalled = false

  var next = function (data) {
    if (nextCalled) {
      util.warn('transition.next() should be called only once.')
      return
    }
    nextCalled = true
    if (!cb || transition.aborted) {
      return
    }
    cb(data)
  }

  var abort = function () {
    cleanup && cleanup()
    transition.abort()
  }

  var onError = function (err) {
    // cleanup indicates an after-activation hook,
    // so instead of aborting we just let the transition
    // finish.
    cleanup ? next() : abort()
    if (err && !transition.router._suppress) {
      util.warn('Uncaught error during transition: ')
      throw err instanceof Error ? err : new Error(err)
    }
  }

  // the copied transition object passed to the user.
  var exposed = {
    to: transition.to,
    from: transition.from,
    abort: abort,
    next: next,
    redirect: function () {
      transition.redirect.apply(transition, arguments)
    }
  }
  var res
  try {
    res = hook.call(context, exposed)
  } catch (err) {
    return onError(err)
  }
  var promise = util.isPromise(res)
  if (expectBoolean) {
    if (typeof res === 'boolean') {
      res ? next() : abort()
    } else if (promise) {
      res.then(function (ok) {
        ok ? next() : abort()
      }, onError)
    }
  } else if (promise) {
    res.then(next, onError)
  }
}

module.exports = Transition
