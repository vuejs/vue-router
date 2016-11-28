import { resolveQuery, stringifyQuery } from '../../../src/util/query'

describe('Query utils', () => {
  describe('resolveQuery', () => {
    it('should work', () => {
      const query = resolveQuery('foo=bar&foo=k', { baz: 'qux' })
      expect(JSON.stringify(query)).toBe(JSON.stringify({
        foo: ['bar', 'k'],
        baz: 'qux'
      }))
    })
  })
})
