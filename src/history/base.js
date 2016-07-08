import { runQueue } from '../util/async'

export class History {
  constructor (initialLocation = '/') {
    this.current = initialLocation
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
    this.confirmTransition(location, () => {
      this._push(location)
      this.updateLocation(location)
    })
  }

  replace (location) {
    this.confirmTransition(location, () => {
      this._replace(location)
      this.updateLocation(location)
    })
  }

  confirmTransition (location, cb) {
    const redirect = location => this.push(location)
    runQueue(this.beforeHooks, (hook, next) => {
      hook(location, redirect, next)
    }, cb)
  }

  updateLocation (location) {
    this.current = location
    this.cb && this.cb(location)
    this.afterHooks.forEach(hook => {
      hook(location)
    })
  }
}
