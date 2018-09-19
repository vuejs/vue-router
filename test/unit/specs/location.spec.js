import { normalizeLocation } from '../../../src/util/location'

describe('Location utils', () => {
  describe('normalizeLocation', () => {
    it('string', () => {
      const loc = normalizeLocation('/abc?foo=bar&baz=qux#hello')
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('empty string', function () {
      const loc = normalizeLocation('', { path: '/abc', state: null })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('')
      expect(loc.state).toBe(undefined)
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({}))
    })

    it('undefined', function () {
      const loc = normalizeLocation({}, { path: '/abc', state: { a: { b: 1 }}})
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({}))
      expect(loc.state).toEqual(undefined)
    })

    it('relative', () => {
      const loc = normalizeLocation('abc?foo=bar&baz=qux#hello', {
        path: '/root/next'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
      expect(loc.state).toEqual(undefined)
    })

    it('relative append', () => {
      const loc = normalizeLocation('abc?foo=bar&baz=qux#hello', {
        path: '/root/next'
      }, true)
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/next/abc')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
      expect(loc.state).toEqual(undefined)
    })

    it('relative query & hash', () => {
      const loc = normalizeLocation('?foo=bar&baz=qux#hello', {
        path: '/root/next'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/root/next')
      expect(loc.hash).toBe('#hello')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('relative params (named)', () => {
      const loc = normalizeLocation(
        {
          params: { lang: 'fr' },
          state: { lang: 'fr', foo: 'bar' }
        },
        {
          name: 'hello',
          params: { lang: 'en', id: 'foo' }
        }
      )
      expect(loc._normalized).toBe(true)
      expect(loc.name).toBe('hello')
      expect(loc.params).toEqual({ lang: 'fr', id: 'foo' })
      expect(loc.state).toEqual({ lang: 'fr', foo: 'bar' })
    })

    it('relative params (non-named)', () => {
      const loc = normalizeLocation({ params: { lang: 'fr' }}, {
        path: '/en/foo',
        params: { lang: 'en', id: 'foo' },
        matched: [{ path: '/:lang/:id' }]
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/fr/foo')
      expect(loc.state).toEqual(undefined)
    })

    it('relative append', () => {
      const loc = normalizeLocation({ path: 'a', state: 123 }, { path: '/b' }, true)
      expect(loc.path).toBe('/b/a')
      expect(loc.state).toBe(123)
      const loc2 = normalizeLocation({ path: 'a', append: true, state: true }, { path: '/b' })
      expect(loc2.path).toBe('/b/a')
      expect(loc2.state).toBe(true)
    })

    it('object', () => {
      const loc = normalizeLocation({
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol',
        state: {
          foo: null,
          bar: undefined,
          baz: 123
        }
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('#lol')
      expect(loc.state).toEqual({
        foo: null,
        bar: undefined,
        baz: 123
      })
      expect(loc.query).toEqual({
        foo: 'bar',
        baz: 'qux'
      })
    })

    it('skip normalized', () => {
      const loc1 = {
        _normalized: true,
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol'
      }
      const loc2 = normalizeLocation(loc1)
      expect(loc2.state).toBe(undefined)
      expect(loc1).toBe(loc2)
    })
  })
})
