/* @flow */

import type VueRouter from '../index'
import { inBrowser } from '../util/dom'
import { runQueue } from '../util/async'
import { isSameRoute } from '../util/route'
import { createRoute } from '../create-matcher'

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
  onInit: (cb: Function) => void;
  getLocation: () => string;

  constructor (router: VueRouter, base: ?string) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = createRoute(null, {
      path: '__vue_router_init__'
    })
    this.pending = null
    this.transitionTo(this.getLocation(), route => {
      this.onInit(route)
    })
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
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
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
      return function routeGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }).reverse()
}

function resolveAsyncComponents (matched: Array<RouteRecord>): Array<?Function> {
  return flatMapComponents(matched, (def, _, match, key) => {
    // if it's a function and doesn't have Vue options attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && !def.options) {
      return (route, redirect, next) => def(resolvedDef => {
        match.components[key] = resolvedDef
        next()
      })
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
      m.instances[key] && m.instances[key].child,
      m, key
    ))
  }))
}
