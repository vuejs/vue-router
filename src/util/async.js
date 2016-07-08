export function runQueue (queue, fn, cb) {
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
