/* @flow */

import { install } from './install'
import { createMatcher } from './create-matcher'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'
import { inBrowser, supportsHistory } from './util/dom'

export default class VueRouter {
  static install: () => void;

  app: any;
  options: RouterOptions;
  mode: 'hash' | 'history' | 'abstract';
  history: HashHistory | HTML5History | AbstractHistory;
  match: Matcher;

  constructor (options: RouterOptions = {}) {
    this.app = null
    this.options = options
    this.match = createMatcher(options.routes || [])

    let mode = options.mode || 'hash'
    if (mode === 'history' && !supportsHistory) {
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
        this.history = new HashHistory(this)
        break
      case 'abstract':
        this.history = new AbstractHistory(this)
        break
      default:
        throw new Error(`[vue-router] invalid mode: ${mode}`)
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

  setInitialLocation (location: Location) {
    if (this.mode === 'abstract') {
      this.history.setInitialLocation(this.match(location))
    }
  }
}

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
