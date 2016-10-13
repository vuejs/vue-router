/* @flow */

import type VueRouter from '../index'
import { History } from './base'

export class AbstractHistory extends History {
  index: number;
  stack: Array<Route>;

  constructor (router: VueRouter) {
    super(router)
    this.stack = []
    this.index = -1
  }

  push (location: RawLocation) {
    this.transitionTo(location, route => {
      this.stack = this.stack.slice(0, this.index + 1).concat(route)
      this.index++
    })
  }

  replace (location: RawLocation) {
    this.transitionTo(location, route => {
      this.stack = this.stack.slice(0, this.index).concat(route)
    })
  }

  go (n: number) {
    const targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const route = this.stack[targetIndex]
    this.confirmTransition(route, () => {
      this.index = targetIndex
      this.updateRoute(route)
    })
  }

  ensureURL () {
    // noop
  }
}
