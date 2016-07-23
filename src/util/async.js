/* @flow */

export function runQueue (queue: Array<any>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      fn(queue[index], () => {
        step(index + 1)
      })
    }
  }
  step(0)
}
