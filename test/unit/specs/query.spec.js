import { resolveQuery, stringifyQuery } from '../../../src/util/query'

function encodeURIAndKeepCommas (str) {
  return encodeURIComponent(str).replace('%2C', ',')
}

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
      })).toBe('?foo=bar&baz=qux&arr=1&arr=2')
    })

    it('custom encodeQuery', () => {
      expect(
        stringifyQuery({
          foo: 'bar,bar',
          baz: 'foo;foo'
        }, encodeURIAndKeepCommas)
      ).toBe('?foo=bar,bar&baz=foo%3Bfoo')
    })

    it('not encode query', () => {
      expect(
        stringifyQuery({
          foo: 'bar,bar',
          baz: 'foo;foo'
        }, false)
      ).toBe('?foo=bar,bar&baz=foo;foo')
    })
  })
})
