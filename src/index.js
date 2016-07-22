import { install } from './install'
import { createMatcher } from './create-matcher'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'
import { inBrowser, supportsHistory } from './util/dom'

export default class VueRouter {
  constructor (options = {}) {
    this._rootComponent = null
    this._options = options

    this.match = createMatcher(options.routes || [])

    let mode = options.mode || 'hash'
    if (mode === 'history' && !supportsHistory) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this._mode = mode

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

    this.history.listen(location => {
      this._rootComponent._route = location
    })
  }

  go (location) {
    this.history.push(location)
  }

  replace (location) {
    this.history.replace(location)
  }

  back () {
    this.history.go(-1)
  }

  forward () {
    this.history.go(1)
  }

  beforeEach (fn) {
    this.history.before(fn)
  }

  afterEach (fn) {
    this.history.after(fn)
  }
}

VueRouter.install = install
VueRouter.createMatcher = createMatcher

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
