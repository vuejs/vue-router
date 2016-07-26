/* @flow */

import type VueRouter from '../index'
import { inBrowser } from '../util/dom'
import { runQueue } from '../util/async'
import { isSameRoute } from '../util/route'

export class History {
  router: VueRouter;
  base: string;
  current: Route;
  pending: ?Route;
  cb: Function;

  // implemented by sub-classes
  go: Function;
  push: Function;
  replace: Function;

  constructor (router: VueRouter, base: ?string) {
    this.router = router
    this.base = normalizeBae(base)
    this.current = router.match('/')
    this.pending = null
    this.transitionTo(this.getLocation())
  }

  listen (cb: Function) {
    this.cb = cb
  }

  transitionTo (location: RawLocation, cb?: Function) {
    const route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      cb && cb(route)
    })
  }

  confirmTransition (route: Route, cb: Function) {
    if (isSameRoute(route, this.current)) {
      return
    }

    const {
      deactivated,
      activated
    } = resolveQueue(this.current.matched, route.matched)

    const queue = [].concat(
      // deactivate guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // activate guards
      activated.map(m => m.beforeEnter)
    ).filter(_ => _)

    this.pending = route
    const redirect = location => this.push(location)

    runQueue(
      queue,
      (hook, next) => { hook(route, redirect, next) },
      () => {
        if (isSameRoute(route, this.pending)) {
          this.pending = null
          cb(route)
        }
      }
    )
  }

  updateRoute (route: Route) {
    this.current = route
    this.cb && this.cb(route)
    this.router.afterHooks.forEach(hook => {
      hook && hook(route)
    })
  }

  getLocation (): string {
    return '/'
  }
}

function normalizeBae (base: ?string): string {
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
  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => {
      const component = m.components[key]
      const instance = m.instances[key] && m.instances[key].child
      const guard = typeof component === 'function'
        ? component.options.beforeRouteLeave
        : (component && component.beforeRouteLeave)
      if (guard) {
        return function routeGuard () {
          return guard.apply(instance, arguments)
        }
      }
    })
  }).reverse())
}
