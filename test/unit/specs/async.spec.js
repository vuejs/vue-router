import { runQueue } from '../../../src/util/async'

describe('Async utils', () => {
  describe('runQueue', () => {
    it('should work', done => {
      const calls = []
      const queue = [1, 2, 3, 4, 5].map(i => next => {
        calls.push(i)
        setTimeout(next, 0)
      })
      runQueue(queue, (fn, next) => fn(next), () => {
        expect(calls).toEqual([1, 2, 3, 4, 5])
        done()
      })
    })
  })
})
