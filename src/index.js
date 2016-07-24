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
  mode: 'hash' | 'history' | 'abstract';
  history: HashHistory | HTML5History | AbstractHistory;
  match: Matcher;

  constructor (options: RouterOptions = {}) {
    assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
      `before mounting root instance.`
    )

    this.app = null
    this.options = options
    this.match = createMatcher(options.routes || [])

    let mode = options.mode || 'hash'
    const fallback = mode === 'history' && !supportsHistory
    if (fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }

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

    this.mode = mode

    this.history.listen(location => {
      this.app._route = location
    })
  }

  go (location: Location) {
    this.history.push(location)
  }

  replace (location: Location) {
    this.history.replace(location)
  }

  back () {
    this.history.go(-1)
  }

  forward () {
    this.history.go(1)
  }

  beforeEach (fn: Function) {
    this.history.before(fn)
  }

  afterEach (fn: Function) {
    this.history.after(fn)
  }

  setInitialLocation (location: RawLocation) {
    if (this.history instanceof AbstractHistory) {
      this.history.setInitialRoute(this.match(location))
    }
  }
}

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
