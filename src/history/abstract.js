/* @flow */
/* globals __VUE_SSR_CONTEXT__ */

import type VueRouter from '../index'
import { History } from './base'

export class AbstractHistory extends History {
  index: number;
  stack: Array<Route>;

  constructor (router: VueRouter) {
    super(router)
    this.stack = []
    this.index = 0
  }

  onInit () {
    this.stack = [this.current]
  }

  push (location: RawLocation) {
    super.transitionTo(location, route => {
      this.stack = this.stack.slice(0, this.index + 1).concat(route)
      this.index++
    })
  }

  replace (location: RawLocation) {
    super.transitionTo(location, route => {
      this.stack = this.stack.slice(0, this.index).concat(route)
    })
  }

  go (n: number) {
    const targetIndex = this.index + n
    if (!this.stack) debugger
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const location = this.stack[targetIndex]
    this.confirmTransition(location, () => {
      this.index = targetIndex
      this.updateRoute(location)
    })
  }

  getLocation () {
    return (
      typeof __VUE_SSR_CONTEXT__ !== 'undefined' &&
      __VUE_SSR_CONTEXT__.url
    ) || '/'
  }
}
