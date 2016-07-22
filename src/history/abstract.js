import { History } from './base'

export class AbstractHistory extends History {
  constructor (router) {
    super(router)
    this.stack = [this.current]
    this.index = 0
  }

  push (location) {
    super.push(location, resolvedLocation => {
      this.stack = this.stack.slice(0, this.index + 1).concat(resolvedLocation)
      this.index++
    })
  }

  replace (location) {
    super.replace(location, resolvedLocation => {
      this.stack = this.stack.slice(0, this.index).concat(resolvedLocation)
    })
  }

  go (n) {
    const targetIndex = this.index + n
    if (!this.stack) debugger
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const location = this.stack[targetIndex]
    this.confirmTransition(location, () => {
      this.index = targetIndex
      this.updateLocation(location)
    })
  }

  setInitialLocation (location) {
    this.current = location
    this.stack = [this.current]
    this.index = 0
  }
}
