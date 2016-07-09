import { install } from './install'
import { createMatcher } from './util/match'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'

const inBrowser = typeof window !== 'undefined'
const isHistorySupported = inBrowser && window.history && window.history.pushState

export default class VueRouter {
  constructor (options = {}) {
    this._rootComponent = null
    this._activeViews = []

    this.match = createMatcher(options.routes || [])

    const mode = options.mode || 'hash'
    if (mode === 'history' && !isHistorySupported) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.root)
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
