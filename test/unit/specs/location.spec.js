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
      const loc = normalizeLocation('', { path: '/abc' })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({}))
    })

    it('undefined', function () {
      const loc = normalizeLocation({}, { path: '/abc' })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({}))
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
      const loc = normalizeLocation({ params: { lang: 'fr' }}, {
        name: 'hello',
        params: { lang: 'en', id: 'foo' }
      })
      expect(loc._normalized).toBe(true)
      expect(loc.name).toBe('hello')
      expect(loc.params).toEqual({ lang: 'fr', id: 'foo' })
    })

    it('relative params (non-named)', () => {
      const loc = normalizeLocation({ params: { lang: 'fr' }}, {
        path: '/en/foo',
        params: { lang: 'en', id: 'foo' },
        matched: [{ path: '/:lang(en|fr)/:id' }]
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/fr/foo')
    })

    it('custom regex can be case insensitive', () => {
      const loc = normalizeLocation({ params: { lang: 'FR' }}, {
        path: '/en/foo',
        params: { lang: 'en', id: 'foo' },
        matched: [{ path: '/:lang(en|fr)/:id' }]
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/FR/foo')
    })

    it('relative append', () => {
      const loc = normalizeLocation({ path: 'a' }, { path: '/b' }, true)
      expect(loc.path).toBe('/b/a')
      const loc2 = normalizeLocation({ path: 'a', append: true }, { path: '/b' })
      expect(loc2.path).toBe('/b/a')
    })

    it('object', () => {
      const loc = normalizeLocation({
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol'
      })
      expect(loc._normalized).toBe(true)
      expect(loc.path).toBe('/abc')
      expect(loc.hash).toBe('#lol')
      expect(JSON.stringify(loc.query)).toBe(JSON.stringify({
        foo: 'bar',
        baz: 'qux'
      }))
    })

    it('skip normalized', () => {
      const loc1 = {
        _normalized: true,
        path: '/abc?foo=bar#hello',
        query: { baz: 'qux' },
        hash: 'lol'
      }
      const loc2 = normalizeLocation(loc1)
      expect(loc1).toBe(loc2)
    })

    it('creates copies when not normalized', () => {
      const l1 = { name: 'foo' }
      expect(normalizeLocation(l1)).not.toBe(l1)
      const l2 = { path: '/foo' }
      expect(normalizeLocation(l2)).not.toBe(l2)
      const l3 = { path: '/foo', query: { foo: 'foo' }}
      expect(normalizeLocation(l3)).not.toBe(l3)
    })
  })
})
