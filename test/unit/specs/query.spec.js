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

  describe('stringifyQuery', () => {
    it('should work', () => {
      expect(stringifyQuery({
        foo: 'bar',
        baz: 'qux',
        arr: [1, 2]
      })).toBe('?arr=1&arr=2&baz=qux&foo=bar') // sorted alphabetically
    })
  })
})
