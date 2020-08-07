import { resolveQuery, stringifyQuery } from '../../../src/util/query'

describe('Query utils', () => {
  describe('resolveQuery', () => {
    it('should work', () => {
      const query = resolveQuery('foo=bar&foo=k', { baz: 'qux' })
      expect(JSON.stringify(query)).toBe(
        JSON.stringify({
          foo: ['bar', 'k'],
          baz: 'qux'
        })
      )
    })

    it('should turn empty params into null', () => {
      expect(resolveQuery('?foo&bar=&arr=1&arr&arr=2')).toEqual({
        foo: null,
        bar: '',
        arr: ['1', null, '2']
      })
    })

    it('should keep undefined and null query values', () => {
      const query = resolveQuery('', { a: undefined, b: null })
      expect(query).toEqual({ a: undefined, b: null })
    })

    it('should keep objects query values', () => {
      const query = resolveQuery('', { a: { nested: 'o' }, b: [{ a: true }] })
      expect(query).toEqual({ a: { nested: 'o' }, b: [{ a: true }] })
    })

    it('should keep null query values in arrays', () => {
      const query = resolveQuery('', { baz: [null, '2'] })
      expect(query).toEqual({ baz: [null, '2'] })
    })

    it('should cast query values into string', () => {
      const query = resolveQuery('foo=bar&foo=k', { baz: 1 })
      expect(query.baz).toBe('1')
    })

    it('should cast query array values into string', () => {
      const query = resolveQuery('foo=bar&foo=k', { baz: [1, '2'] })
      expect(query.baz).toEqual(['1', '2'])
    })
  })

  describe('stringifyQuery', () => {
    it('should work', () => {
      expect(
        stringifyQuery({
          foo: 'bar',
          baz: 'qux',
          arr: [1, 2]
        })
      ).toBe('?foo=bar&baz=qux&arr=1&arr=2')
    })

    it('should add only the key with null', () => {
      expect(
        stringifyQuery({
          foo: null,
          bar: '',
          arr: [1, null, 3]
        })
      ).toBe('?foo&bar=&arr=1&arr&arr=3')
    })

    it('should escape reserved chars', () => {
      expect(
        stringifyQuery({
          a: '*()!'
        })
      ).toBe('?a=%2a%28%29%21')
    })

    it('should preserve commas', () => {
      expect(
        stringifyQuery({
          list: '1,2,3'
        })
      ).toBe('?list=1,2,3')
    })
  })
})
