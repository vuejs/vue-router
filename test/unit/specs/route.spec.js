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
        path: '/a/',  // Allow trailing slash
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
  })

  describe('isIncludedRoute', () => {
    it('path', () => {
      const a = { path: '/a/b' }
      const b = { path: '/a' }
      const c = { path: '/a/b/c' }
      expect(isIncludedRoute(a, b)).toBe(true)
      expect(isIncludedRoute(a, c)).toBe(false)
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
  })
})
