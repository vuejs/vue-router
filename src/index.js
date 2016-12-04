/* @flow */

import { install } from './install'
import { createMatcher } from './create-matcher'
import { HashHistory, getHash } from './history/hash'
import { HTML5History, getLocation } from './history/html5'
import { AbstractHistory } from './history/abstract'
import { inBrowser, supportsHistory } from './util/dom'
import { assert } from './util/warn'
import { cleanPath } from './util/path'
import { normalizeLocation } from './util/location'

export default class VueRouter {
  static install: () => void;

  app: any;
  options: RouterOptions;
  mode: string;
  history: HashHistory | HTML5History | AbstractHistory;
  match: Matcher;
  fallback: boolean;
  beforeHooks: Array<?NavigationGuard>;
  afterHooks: Array<?((to: Route, from: Route) => any)>;

  constructor (options: RouterOptions = {}) {
    this.app = null
    this.options = options
    this.beforeHooks = []
    this.afterHooks = []
    this.match = createMatcher(options.routes || [])

    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsHistory
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this)
        break
      default:
        process.env.NODE_ENV !== 'production' && assert(false, `invalid mode: ${mode}`)
    }
  }

  get currentRoute (): ?Route {
    return this.history && this.history.current
  }

  init (app: any /* Vue component instance */) {
    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
      `before creating root instance.`
    )

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(getLocation(history.base))
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        window.addEventListener('hashchange', () => {
          history.onHashChange()
        })
      }
      history.transitionTo(getHash(), setupHashListener, setupHashListener)
    }

    history.listen(route => {
      this.app._route = route
    })
  }

  beforeEach (fn: Function) {
    this.beforeHooks.push(fn)
  }

  afterEach (fn: Function) {
    this.afterHooks.push(fn)
  }

  push (location: RawLocation) {
    this.history.push(location)
  }

  replace (location: RawLocation) {
    this.history.replace(location)
  }

  go (n: number) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  getMatchedComponents (to?: RawLocation): Array<any> {
    const route = to
      ? this.resolve(to).resolved
      : this.currentRoute
    if (!route) {
      return []
    }
    return [].concat.apply([], route.matched.map(m => {
      return Object.keys(m.components).map(key => {
        return m.components[key]
      })
    }))
  }

  resolve (
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    normalizedTo: Location,
    resolved: Route,
    href: string
  } {
    const normalizedTo = normalizeLocation(to, current || this.history.current, append)
    const resolved = this.match(normalizedTo, current)
    const fullPath = resolved.redirectedFrom || resolved.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      normalizedTo,
      resolved,
      href
    }
  }
}

function createHref (base: string, fullPath: string, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
