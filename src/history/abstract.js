import { History } from './base'

export class AbstractHistory extends History {
  constructor (router) {
    super(router)
    this.stack = [this.current]
    this.index = 0
  }

  go (n) {
    const targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const location = this.stack[targetIndex]
    this.confirmTransition(location, () => {
      this.index = targetIndex
      this.updateLocation(location)
    })
  }

  _push (location) {
    this.stack = this.stack.slice(0, this.index + 1).concat(location)
    this.index++
  }

  _replace (location) {
    this.stack = this.stack.slice(0, this.index).concat(location)
  }
}
