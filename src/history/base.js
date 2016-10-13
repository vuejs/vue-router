/* @flow */

import type VueRouter from '../index'
import { warn } from '../util/warn'
import { inBrowser } from '../util/dom'
import { runQueue } from '../util/async'
import { START, isSameRoute } from '../util/route'

export class History {
  router: VueRouter;
  base: string;
  current: Route;
  pending: ?Route;
  cb: (r: Route) => void;

  // implemented by sub-classes
  go: (n: number) => void;
  push: (loc: RawLocation) => void;
  replace: (loc: RawLocation) => void;
  ensureURL: () => void;

  constructor (router: VueRouter, base: ?string) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = START
    this.pending = null
  }

  listen (cb: Function) {
    this.cb = cb
  }

  transitionTo (location: RawLocation, cb?: Function) {
    const route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      cb && cb(route)
      this.ensureURL()
    })
  }

  confirmTransition (route: Route, cb: Function) {
    const current = this.current
    if (isSameRoute(route, current)) {
      this.ensureURL()
      return
    }

    const {
      deactivated,
      activated
    } = resolveQueue(this.current.matched, route.matched)

    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    )

    this.pending = route
    const iterator = (hook: NavigationGuard, next) => {
      if (this.pending !== route) return
      hook(route, current, (to: any) => {
        if (to === false) {
          // next(false) -> abort navigation, ensure current URL
          this.ensureURL()
        } else if (typeof to === 'string' || typeof to === 'object') {
          // next('/') or next({ path: '/' }) -> redirect
          this.push(to)
        } else {
          // confirm transition and pass on the value
          next(to)
        }
      })
    }

    runQueue(queue, iterator, () => {
      const postEnterCbs = []
      const enterGuards = extractEnterGuards(activated, postEnterCbs, () => {
        return this.current === route
      })
      // wait until async components are resolved before
      // extracting in-component enter guards
      runQueue(enterGuards, iterator, () => {
        if (this.pending === route) {
          this.pending = null
          cb(route)
          this.router.app.$nextTick(() => {
            postEnterCbs.forEach(cb => cb())
          })
        }
      })
    })
  }

  updateRoute (route: Route) {
    const prev = this.current
    this.current = route
    this.cb && this.cb(route)
    this.router.afterHooks.forEach(hook => {
      hook && hook(route, prev)
    })
  }
}

function normalizeBase (base: ?string): string {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = baseEl ? baseEl.getAttribute('href') : '/'
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  activated: Array<RouteRecord>,
  deactivated: Array<RouteRecord>
} {
  let i
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractLeaveGuards (matched: Array<RouteRecord>): Array<?Function> {
  return flatMapComponents(matched, (def, instance) => {
    const guard = def && def.beforeRouteLeave
    if (guard) {
      return function routeLeaveGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }).reverse()
}

function extractEnterGuards (
  matched: Array<RouteRecord>,
  cbs: Array<Function>,
  isValid: () => boolean
): Array<?Function> {
  return flatMapComponents(matched, (def, _, match, key) => {
    const guard = def && def.beforeRouteEnter
    if (guard) {
      return function routeEnterGuard (to, from, next) {
        return guard(to, from, cb => {
          next(cb)
          if (typeof cb === 'function') {
            cbs.push(() => {
              // #750
              // if a router-view is wrapped with an out-in transition,
              // the instance may not have been registered at this time.
              // we will need to poll for registration until current route
              // is no longer valid.
              poll(cb, match.instances, key, isValid)
            })
          }
        })
      }
    }
  })
}

function poll (cb, instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key])
  } else if (isValid()) {
    setTimeout(() => {
      poll(cb, instances, key, isValid)
    }, 16)
  }
}

function resolveAsyncComponents (matched: Array<RouteRecord>): Array<?Function> {
  return flatMapComponents(matched, (def, _, match, key) => {
    // if it's a function and doesn't have Vue options attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && !def.options) {
      return (to, from, next) => {
        const resolve = resolvedDef => {
          match.components[key] = resolvedDef
          next()
        }

        const reject = reason => {
          warn(false, `Failed to resolve async component ${key}: ${reason}`)
          next(false)
        }

        const res = def(resolve, reject)
        if (res && typeof res.then === 'function') {
          res.then(resolve, reject)
        }
      }
    }
  })
}

function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {
  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => fn(
      m.components[key],
      m.instances[key],
      m, key
    ))
  }))
}
