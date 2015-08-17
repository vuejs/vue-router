import { warn, mapParams, isPromise } from './util'
import {
  activate, deactivate, reuse,
  canActivate, canDeactivate, canReuse
} from './pipeline'

// avoid infinite redirect loops on error
const MAX_ERROR_REDIRECTS = 10
let errorCount = 0

/**
 * A RouteTransition object manages the pipeline of a
 * router-view switching process. This is also the object
 * passed into user route hooks.
 *
 * @param {Router} router
 * @param {Route} to
 * @param {Route} from
 */

export default class RouteTransition {

  constructor (router, to, from) {
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
    let matched = to._matched
      ? Array.prototype.slice.call(to._matched)
      : []

    // the activate queue is an array of route handlers
    // that need to be activated
    this.activateQueue = matched.map(function (match) {
      return match.handler
    })
  }

  /**
   * Abort current transition and return to previous location.
   *
   * @param {Boolean} back
   */

  abort (back) {
    if (!this.aborted) {
      this.aborted = true
      if (back !== false) {
        this.router.replace(this.from.path || '/')
      }
    }
  }

  /**
   * Abort current transition and redirect to a new location.
   *
   * @param {String} path
   */

  redirect (path) {
    if (!this.aborted) {
      this.aborted = true
      path = mapParams(path, this.to.params, this.to.query)
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

  start (cb) {
    let transition = this
    let daq = this.deactivateQueue
    let aq = this.activateQueue
    let rdaq = daq.slice().reverse()
    let reuseQueue

    // 1. Reusability phase
    let i
    for (i = 0; i < rdaq.length; i++) {
      if (!canReuse(rdaq[i], aq[i], transition)) {
        break
      }
    }
    if (i > 0) {
      reuseQueue = rdaq.slice(0, i)
      daq = rdaq.slice(i).reverse()
      aq = aq.slice(i)
    }

    // 2. Validation phase
    transition.runQueue(daq, canDeactivate, () => {
      transition.runQueue(aq, canActivate, () => {
        transition.runQueue(daq, deactivate, () => {
          // 3. Activation phase

          // Update router current route
          transition.router._updateRoute(transition.to)

          // trigger reuse for all reused views
          reuseQueue && reuseQueue.forEach(function (view) {
            reuse(view, transition)
          })

          // the root of the chain that needs to be replaced
          // is the top-most non-reusable view.
          if (daq.length) {
            let view = daq[daq.length - 1]
            let depth = reuseQueue ? reuseQueue.length : 0
            activate(view, transition, depth, cb)
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

  runQueue (queue, fn, cb) {
    let transition = this
    step(0)
    function step (index) {
      if (index >= queue.length) {
        cb()
      } else {
        fn(queue[index], transition, () => {
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

  callHook (hook, context, cb, expectBoolean, cleanup) {
    let transition = this
    let nextCalled = false

    // advance the transition to the next step
    let next = (data) => {
      if (nextCalled) {
        warn('transition.next() should be called only once.')
        return
      }
      nextCalled = true
      if (!cb || transition.aborted) {
        return
      }
      cb(data)
    }

    // abort the transition
    let abort = (back) => {
      cleanup && cleanup()
      transition.abort(back)
    }

    // handle errors
    let onError = (err) => {
      // prevent infinite error redirects
      errorCount++
      let canGoBack = errorCount < MAX_ERROR_REDIRECTS
      if (!canGoBack) {
        errorCount = 0
      }
      // cleanup indicates an after-activation hook,
      // so instead of aborting we just let the transition
      // finish.
      cleanup ? next() : abort(canGoBack)
      if (err && !transition.router._suppress) {
        warn('Uncaught error during transition: ')
        throw err instanceof Error ? err : new Error(err)
      }
    }

    // expose a clone of the transition object, so that each
    // hook gets a clean copy and prevent the user from
    // messing with the internals.
    let exposed = {
      to: transition.to,
      from: transition.from,
      abort: abort,
      next: next,
      redirect: function () {
        transition.redirect.apply(transition, arguments)
      }
    }

    // actually call the hook
    let res
    try {
      res = hook.call(context, exposed)
    } catch (err) {
      return onError(err)
    }

    // handle boolean/promise return values
    let resIsPromise = isPromise(res)
    if (expectBoolean) {
      if (typeof res === 'boolean') {
        res ? next() : abort()
      } else if (resIsPromise) {
        res.then(function (ok) {
          ok ? next() : abort()
        }, onError)
      }
    } else if (resIsPromise) {
      res.then(next, onError)
    }
  }
}
