import { runQueue } from '../util/async'
import { createLocationUtil } from '../util/location'

export class History {
  constructor (map) {
    const util = createLocationUtil(map)
    this.normalizeLocation = util.normalizeLocation
    this.isSameLocation = util.isSameLocation
    this.current = util.normalizeLocation('/')
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
    location = this.normalizeLocation(location, this.current)

    if (this.isSameLocation(location, this.pending) ||
        this.isSameLocation(location, this.current)) {
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
        if (this.isSameLocation(location, this.pending)) {
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
