import { install } from './install'
import { createMatcher } from './util/match'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'

export default class VueRouter {
  constructor (options = {}) {
    this._rootComponent = null

    const root = this._root = options.root || '/'
    const mode = this._mode = options.mode || 'hash'

    this.match = createMatcher(options.routes || [])

    switch (mode) {
      case 'html5':
        this.history = new HTML5History(root)
        break
      case 'hash':
        this.history = new HashHistory()
        break
      case 'abstract':
        this.history = new AbstractHistory()
        break
      default:
        throw new Error(`[vue-router] invalid mode: ${mode}`)
    }

    this.history.listen(location => {
      this._rootComponent._route = this.match(location)
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

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueRouter)
}
