import { isSameRoute, isIncludedRoute } from '../../../src/util/route'

describe('Route utils', () => {
  describe('isSameRoute', () => {
    it('path', () => {
      const a = {
        path: '/a',
        hash: '#hi',
        query: { foo: 'bar', arr: [1, 2] }
      }
      const b = {
        path: '/a/', // Allow trailing slash
        hash: '#hi',
        query: { arr: ['1', '2'], foo: 'bar' }
      }
      expect(isSameRoute(a, b)).toBe(true)
    })

    it('name', () => {
      const a = {
        path: '/abc',
        name: 'a',
        hash: '#hi',
        query: { foo: 'bar', arr: [1, 2] }
      }
      const b = {
        name: 'a',
        hash: '#hi',
        query: { arr: ['1', '2'], foo: 'bar' }
      }
      expect(isSameRoute(a, b)).toBe(true)
    })

    it('nested query', () => {
      const a = {
        path: '/abc',
        query: { foo: { bar: 'bar' }, arr: [1, 2] }
      }
      const b = {
        path: '/abc',
        query: { arr: [1, 2], foo: { bar: 'bar' }}
      }
      const c = {
        path: '/abc',
        query: { arr: [1, 2], foo: { bar: 'not bar' }}
      }
      expect(isSameRoute(a, b)).toBe(true)
      expect(isSameRoute(a, c)).toBe(false)
    })

    it('queries with null values', () => {
      const a = {
        path: '/abc',
        query: { foo: null }
      }
      const b = {
        path: '/abc',
        query: { foo: null }
      }
      const c = {
        path: '/abc',
        query: { foo: 5 }
      }
      expect(() => isSameRoute(a, b)).not.toThrow()
      expect(() => isSameRoute(a, c)).not.toThrow()
      expect(isSameRoute(a, b)).toBe(true)
      expect(isSameRoute(a, c)).toBe(false)
    })

    it('queries with undefined values', () => {
      const a = {
        path: '/abc',
        query: { a: 'x' }
      }
      const b = {
        path: '/abc',
        query: { id: undefined }
      }
      const c = {
        path: '/abc',
        query: {}
      }
      expect(() => isSameRoute(a, b)).not.toThrow()
      expect(() => isSameRoute(a, c)).not.toThrow()
      expect(() => isSameRoute(b, c)).not.toThrow()
      expect(isSameRoute(a, b)).toBe(false)
      expect(isSameRoute(a, c)).toBe(false)
      // NOTE: in reality this should be true but because we check queries as
      // objects, they are different objects. We should check queries as their
      // string representation instead
      expect(isSameRoute(b, c)).toBe(false)
      expect(isSameRoute(c, b)).toBe(false)
    })
  })

  describe('isIncludedRoute', () => {
    it('path', () => {
      const a = { path: '/a/b' }
      const b = { path: '/a' }
      const c = { path: '/a/b/c' }
      const d = { path: '/a/b/' }
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(false)
      expect(isIncludedRoute(a, d)).toBe(true)
    })

    it('with hash', () => {
      const a = { path: '/a/b', hash: '#a' }
      const b = { path: '/a' }
      const c = { path: '/a', hash: '#a' }
      const d = { path: '/a', hash: '#b' }
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
    })

    it('with query', () => {
      const a = { path: '/a/b', query: { foo: 'bar', baz: 'qux' }}
      const b = { path: '/a', query: {}}
      const c = { path: '/a', query: { foo: 'bar' }}
      const d = { path: '/a', query: { foo: 'bar', a: 'b' }}
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
    })

    it('with both', () => {
      const a = { path: '/a/b', query: { foo: 'bar', baz: 'qux' }, hash: '#a' }
      const b = { path: '/a', query: {}}
      const c = { path: '/a', query: { foo: 'bar' }}
      const d = { path: '/a', query: { foo: 'bar' }, hash: '#b' }
      const e = { path: '/a', query: { a: 'b' }, hash: '#a' }
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(true)
      expect(isIncludedRoute(a, d)).toBe(false)
      expect(isIncludedRoute(a, e)).toBe(false)
    })

    it('trailing slash', () => {
      const a = { path: '/users' }
      const b = { path: '/user' }
      const c = { path: '/users/' }
      expect(isIncludedRoute(a, b)).toBe(false)
      expect(isIncludedRoute(a, c)).toBe(true)

      const d = { path: '/users/hello/world' }
      const e = { path: '/users/hello' }
      const f = { path: '/users/hello-world' }
      expect(isIncludedRoute(d, e)).toBe(true)
      expect(isIncludedRoute(d, f)).toBe(false)
    })
  })
})
