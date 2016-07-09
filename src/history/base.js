import { runQueue } from '../util/async'
import { normalizeLocation, isSameLocation } from '../util/location'

export class History {
  constructor () {
    this.current = normalizeLocation('/')
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
    this.confirmTransition(location, normalizedLocation => {
      this._push(normalizedLocation)
      this.updateLocation(normalizedLocation)
    })
  }

  replace (location) {
    this.confirmTransition(location, normalizedLocation => {
      this._replace(normalizedLocation)
      this.updateLocation(normalizedLocation)
    }, true)
  }

  confirmTransition (location, cb, replace) {
    location = normalizeLocation(location, this.current)

    if (isSameLocation(location, this.pending) ||
        isSameLocation(location, this.current)) {
      return
    }

    this.pending = location

    const redirect = location => {
      this[replace ? 'replace' : 'push'](location)
    }

    runQueue(
      this.beforeHooks,
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
