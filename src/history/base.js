import { runQueue } from '../util/async'
import { isSameLocation } from '../util/location'

export class History {
  constructor (match) {
    this.match = match
    this.current = match('/')
    this.pending = null
    this.beforeHooks = []
    this.afterHooks = []
  }

  listen (cb) {
    this.cb = cb
  }

  before (fn) {
    this.beforeHooks.push(fn)
  }

  after (fn) {
    this.afterHooks.push(fn)
  }

  push (location) {
    location = this.match(location, this.current)
    this.confirmTransition(location, () => {
      this._push(location)
      this.updateLocation(location)
    })
  }

  replace (location) {
    location = this.match(location, this.current)
    this.confirmTransition(location, () => {
      this._replace(location)
      this.updateLocation(location)
    }, true)
  }

  confirmTransition (location, cb, replace) {
    if (isSameLocation(location, this.pending) ||
        isSameLocation(location, this.current)) {
      return
    }

    this.pending = location

    const redirect = location => this[replace ? 'replace' : 'push'](location)
    const routeBeforeHooks = location.matched.map(m => m.onEnter).filter(_ => _)
    const beforeHooks = this.beforeHooks.concat(routeBeforeHooks)

    runQueue(
      beforeHooks,
      (hook, next) => {
        hook(location, redirect, next)
      },
      () => {
        if (isSameLocation(location, this.pending)) {
          this.pending = null
          cb(location)
        }
      }
    )
  }

  updateLocation (location) {
    this.current = location
    this.cb && this.cb(location)
    this.afterHooks.forEach(hook => {
      hook(location)
    })
  }
}
