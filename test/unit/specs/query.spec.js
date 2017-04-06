import { resolveQuery, stringifyQuery, parseQuery } from '../../../src/util/query'

describe('Query utils', () => {
  describe('resolveQuery', () => {
    it('should work', () => {
      const query = resolveQuery('foo=bar&foo=k', { baz: 'qux', quux: { corge: 'grault' }, arr: [1, 2] })
      expect(JSON.stringify(query)).toBe(JSON.stringify({
        foo: ['bar', 'k'],
        baz: 'qux',
        quux: { corge: 'grault' },
        arr: [1, 2]
      }))
    })
  })

  describe('stringifyQuery', () => {
    it('should work', () => {
      expect(stringifyQuery({
        foo: 'bar',
        baz: 'qux',
        arr: [1, 2]
      })).toBe('?foo=bar&baz=qux&arr=1&arr=2')

      expect(stringifyQuery({
        foo: 'bar',
        quux: { corge: 'grault' },
        arr: [1, 2]
      })).toBe('?foo=bar&quux%5Bcorge%5D=grault&arr=1&arr=2')
    })

    it('should escape reserved chars', () => {
      expect(stringifyQuery({
        a: '*()!'
      })).toBe('?a=%2a%28%29%21')
    })

    it('should preserve commas', () => {
      expect(stringifyQuery({
        list: '1,2,3'
      })).toBe('?list=1,2,3')
    })
  })
})
