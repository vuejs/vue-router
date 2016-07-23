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
  beforeHooks: Array<Function>;
  afterHooks: Array<Function>;
  cb: Function;

  constructor (router: VueRouter, base: ?string) {
    this.router = router
    this.base = normalizeBae(base)
    this.current = router.match(this.getLocation())
    this.pending = null
    this.beforeHooks = []
    this.afterHooks = []
  }

  listen (cb: Function) {
    this.cb = cb
  }

  before (fn: Function) {
    this.beforeHooks.push(fn)
  }

  after (fn: Function) {
    this.afterHooks.push(fn)
  }

  push (location: RawLocation, cb?: Function) {
    this.transitionTo(location, cb)
  }

  replace (location: RawLocation, cb?: Function) {
    this.transitionTo(location, cb, true)
  }

  transitionTo (location: RawLocation, cb?: Function, replace?: boolean) {
    const route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      cb && cb(route)
    }, replace)
  }

  confirmTransition (route: Route, cb: Function, replace?: boolean) {
    if (isSameRoute(route, this.current)) {
      return
    }

    const {
      deactivated,
      activated
    } = resolveQueue(this.current.matched, route.matched)

    const queue = this.beforeHooks.concat(
      // route config canDeactivate hooks
      deactivated.map(m => m.canDeactivate).reverse(),
      // component canDeactivate hooks
      extractComponentHooks(deactivated, 'routeCanDeactivate').reverse(),
      // route config canActivate hooks
      activated.map(m => m.canActivate),
      // component canActivate hooks
      extractComponentHooks(activated, 'routeCanActivate')
    ).filter(_ => _)

    this.pending = route
    const redirect = replace
      ? location => this.replace(location)
      : location => this.push(location)

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
    this.afterHooks.forEach(hook => {
      hook(route)
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

function extractComponentHooks (
  matched: Array<RouteRecord>,
  name: string
): Array<?Function> {
  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => {
      const component = m.components[key]
      const instance = m.instances[key] && m.instances[key].child
      const hook = typeof component === 'function'
        ? component.options[name]
        : component[name]
      if (hook) {
        return function routerHook () {
          return hook.apply(instance, arguments)
        }
      }
    })
  }))
}
