import { resolvePath, parsePath, cleanPath } from '../../../src/util/path'

describe('Path utils', () => {
  describe('resolvePath', () => {
    it('absolute', () => {
      const path = resolvePath('/a', '/b')
      expect(path).toBe('/a')
    })

    it('relative', () => {
      const path = resolvePath('c/d', '/b')
      expect(path).toBe('/c/d')
    })

    it('relative with append', () => {
      const path = resolvePath('c/d', '/b', true)
      expect(path).toBe('/b/c/d')
    })

    it('relative parent', () => {
      const path = resolvePath('../d', '/a/b/c')
      expect(path).toBe('/a/d')
    })

    it('relative parent with append', () => {
      const path = resolvePath('../d', '/a/b/c', true)
      expect(path).toBe('/a/b/d')
    })

    it('relative query', () => {
      const path = resolvePath('?foo=bar', '/a/b')
      expect(path).toBe('/a/b?foo=bar')
    })

    it('relative hash', () => {
      const path = resolvePath('#hi', '/a/b')
      expect(path).toBe('/a/b#hi')
    })
  })

  describe('parsePath', () => {
    it('plain', () => {
      const res = parsePath('/a')
      expect(res.path).toBe('/a')
      expect(res.hash).toBe('')
      expect(res.query).toBe('')
    })

    it('query', () => {
      const res = parsePath('/a?foo=bar???')
      expect(res.path).toBe('/a')
      expect(res.hash).toBe('')
      expect(res.query).toBe('foo=bar???')
    })

    it('hash', () => {
      const res = parsePath('/a#haha#hoho')
      expect(res.path).toBe('/a')
      expect(res.hash).toBe('#haha#hoho')
      expect(res.query).toBe('')
    })

    it('both', () => {
      const res = parsePath('/a?foo=bar#ok?baz=qux')
      expect(res.path).toBe('/a')
      expect(res.hash).toBe('#ok?baz=qux')
      expect(res.query).toBe('foo=bar')
    })
  })

  describe('cleanPath', () => {
    it('should work', () => {
      const path = cleanPath('//a//b//d/')
      expect(path).toBe('/a/b/d/')
    })
  })
})
