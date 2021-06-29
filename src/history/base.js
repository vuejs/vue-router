/* @flow */

import { _Vue } from '../install'
import type Router from '../index'
import { inBrowser } from '../util/dom'
import { runQueue } from '../util/async'
import { warn } from '../util/warn'
import { START, isSameRoute, handleRouteEntered } from '../util/route'
import {
  flatten,
  flatMapComponents,
  resolveAsyncComponents
} from '../util/resolve-components'
import {
  createNavigationDuplicatedError,
  createNavigationCancelledError,
  createNavigationRedirectedError,
  createNavigationAbortedError,
  isError,
  isNavigationFailure,
  NavigationFailureType
} from '../util/errors'

export class History {
  router: Router
  base: string
  current: Route
  pending: ?Route
  cb: (r: Route) => void
  ready: boolean
  readyCbs: Array<Function>
  readyErrorCbs: Array<Function>
  errorCbs: Array<Function>
  listeners: Array<Function>
  cleanupListeners: Function

  // implemented by sub-classes
  +go: (n: number) => void
  +push: (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
  +replace: (
    loc: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) => void
  +ensureURL: (push?: boolean) => void
  +getCurrentLocation: () => string
  +setupListeners: Function

  constructor (router: Router, base: ?string) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
    this.listeners = []
  }

  listen (cb: Function) {
    this.cb = cb
  }

  onReady (cb: Function, errorCb: ?Function) {
    if (this.ready) {
      cb()
    } else {
      this.readyCbs.push(cb)
      if (errorCb) {
        this.readyErrorCbs.push(errorCb)
      }
    }
  }

  onError (errorCb: Function) {
    this.errorCbs.push(errorCb)
  }

  // 做路由切换
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route
    // catch redirect option https://github.com/vuejs/vue-router/issues/3201
    try {
      // 先将 location 匹配出一个 route 对象
      route = this.router.match(location, this.current)
    } catch (e) {
      this.errorCbs.forEach(cb => {
        cb(e)
      })
      // Exception should still be thrown
      throw e
    }
    const prev = this.current
    // 匹配到后，确认这次路由切换
    this.confirmTransition(
      route,
      () => {
        // 路由切换完成会依次执行：
        // 1、更新路由
        // 2、回调 onComplete（pushState & handleScroll）
        // 3、确认URL（如果不一致的话）
        // 4、afterEach
        // 5、ready cb
        this.updateRoute(route)
        onComplete && onComplete(route)
        this.ensureURL()
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
        if (err && !this.ready) {
          // Initial redirection should not mark the history as ready yet
          // because it's triggered by the redirection instead
          // https://github.com/vuejs/vue-router/issues/3225
          // https://github.com/vuejs/vue-router/issues/3331
          if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
            this.ready = true
            this.readyErrorCbs.forEach(cb => {
              cb(err)
            })
          }
        }
      }
    )
  }

  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    this.pending = route
    const abort = err => {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach(cb => {
            cb(err)
          })
        } else {
          warn(false, 'uncaught error during route navigation:')
          console.error(err)
        }
      }
      onAbort && onAbort(err)
    }
    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      this.ensureURL()
      return abort(createNavigationDuplicatedError(current, route))
    }

    // 根据 current.matched 和 route.matched (next) 得到:
    // updated 需要更新的组件
    // deactivated 需要离开的组件
    // activated 需要进入的组件
    // matched 基于 formatMatch 产生，顺序为父组件 -> 子组件
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )

    // 按顺序依次执行
    // beforeRouteLeave
    // beforeEach
    // beforeRouteUpdate
    // beforeEnter
    // resolve async components
    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    )

    // 执行 hook，hook 执行完毕执行 next
    const iterator = (hook: NavigationGuard, next) => {
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        // eg: beforeRouteEnter(to, from, next)
        // 某一个导航守卫执行完之后，需要做什么（调用 next），有四种用法：
        // n1. next(false) 终止导航
        // n2. next(new Error('error')) 抛出错误
        // n3. next('/') or next({ path: '/' }) or next({ name: 'route-name' }) 重定向
        // n4. next() 确认该路由，执行队列中下一个 hook
        // 前三种都会 abort 不同的错误
        hook(route, current, (to: any) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    // 对 queue 里的每一个任务顺序执行 iterator
    // 整个 queue 完整执行后，调用回调函数
    runQueue(queue, iterator, () => {
      // wait until async components are resolved before
      // extracting in-component enter guards
      // enterGuards 是 [routeEnterGuard]
      const enterGuards = extractEnterGuards(activated)
      // 依次执行: beforeRouteEnter、beforeResolve
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null
        // 执行 onComplete，afterEach
        onComplete(route)
        if (this.router.app) {
          // DOM 更新后，执行 next 的回调 enteredCbs
          this.router.app.$nextTick(() => {
            handleRouteEntered(route)
          })
        }
      })
    })
  }

  updateRoute (route: Route) {
    this.current = route
    this.cb && this.cb(route)
  }

  setupListeners () {
    // Default implementation is empty
  }

  teardown () {
    // clean up event listeners
    // https://github.com/vuejs/vue-router/issues/2341
    this.listeners.forEach(cleanupListener => {
      cleanupListener()
    })
    this.listeners = []

    // reset current history route
    // https://github.com/vuejs/vue-router/issues/3294
    this.current = START
    this.pending = null
  }
}

function normalizeBase (base: ?string): string {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '')
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

// 计算离开、更新、进入的组件
// 这里的 current 和 next 里面的组件都是有顺序的，父组件 -> 子组件
function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  updated: Array<RouteRecord>,
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
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  // 对一组组件，提取它们的路由守卫
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    // def 组件，name 守卫名字，如 beforeRouteEnter
    const guard = extractGuard(def, name)
    // 将路由守卫绑定到当前实例
    // guard.apply(instance, arguments)，参考 bindGuard
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  // reverse 影响着这一组守卫的执行顺序
  // guards 的执行顺序由一开始的 records: Array<RouteRecord> 决定
  // 这个顺序由 formatMatch 决定，即 [ root, ..., parent, child, ... ]
  // 一般来说，组件中守卫的执行顺序应该是父组件->子组件
  // 但是 beforeRouteLeave 的时候 reverse 为 true，即子组件->父组件
  return flatten(reverse ? guards.reverse() : guards)
}

// 提取组件中定义的守卫
function extractGuard (
  def: Object | Function, // component 可以是一个对象或者函数（懒加载）
  key: string
): NavigationGuard | Array<NavigationGuard> {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    // TODO extend 会发生什么
    def = _Vue.extend(def)
  }
  return def.options[key]
}

// 提取 deactivated 组件的 beforeRouteLeave
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

// 提取 updated 组件的 beforeRouteUpdate
function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

// 将守卫绑定在当前 vue 实例中
function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

// 提取 activated 组件的 beforeRouteEnter
// beforeRouteEnter 与另外两个组件内守卫不一样的是，不能获取到组件实例 this
function extractEnterGuards (
  activated: Array<RouteRecord>
): Array<?Function> {
  return extractGuards(
    activated,
    'beforeRouteEnter',
    // instance 使用占位符省略
    (guard, _, match, key) => {
      // 这里并没有传入 instance
      return bindEnterGuard(guard, match, key)
    }
  )
}

// beforeRouteEnter 不能直接获取组件实例 this
// 而是通过调用 next 传入回调函数，在回调函数中获取 this
function bindEnterGuard (
  guard: NavigationGuard,
  match: RouteRecord,
  key: string
): NavigationGuard {
  // 在 iterator 的 hook() 调用
  return function routeEnterGuard (to, from, next) {
    // 这个 guard 才是我们自己写的
    // beforeRouteEnter(to, from, next)
    // n5. next(() => {}) 收集 next 的回调函数
    return guard(to, from, cb => {
      if (typeof cb === 'function') {
        if (!match.enteredCbs[key]) {
          match.enteredCbs[key] = []
        }
        match.enteredCbs[key].push(cb)
      }
      next(cb)
    })
  }
}
