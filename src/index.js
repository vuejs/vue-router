/* @flow */

import { install } from './install'
import { createMatcher } from './create-matcher'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'
import { inBrowser, supportsHistory } from './util/dom'
import { assert } from './util/warn'

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
  }

  get currentRoute (): ?Route {
    return this.history && this.history.current
  }

  init (app: any /* Vue component instance */) {
    assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
      `before creating root instance.`
    )

    this.app = app

    const { mode, options, fallback } = this
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this)
        break
      default:
        assert(false, `invalid mode: ${mode}`)
    }

    this.history.listen(route => {
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

  getMatchedComponents (): Array<any> {
    if (!this.currentRoute) {
      return []
    }
    return [].concat.apply([], this.currentRoute.matched.map(m => {
      return Object.keys(m.components).map(key => {
        return m.components[key]
      })
    }))
  }
}

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
