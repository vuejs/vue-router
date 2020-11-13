import { History } from '../../../src/history/base'

describe('Base history', () => {
  describe('normalizeBase', () => {
    it('allows full URL', () => {
      const history = new History(undefined, 'https://somedomain.com/some/path')
      history.base
      expect(history.base).toBe('https://somedomain.com/some/path')
    })

    it('removes trailing slash from full URL', () => {
      const history = new History(undefined, 'https://somedomain.com/some/path/')
      history.base
      expect(history.base).toBe('https://somedomain.com/some/path')
    })

    it('removes trailing slash from full URL', () => {
      const history = new History(undefined, 'https://somedomain.com/some/path/')
      history.base
      expect(history.base).toBe('https://somedomain.com/some/path')
    })

    it('prefixes relative urls with a slash', () => {
      const history = new History(undefined, 'some/path/')
      history.base
      expect(history.base).toBe('/some/path')
    })

    it('defaults to empty string', () => {
      const history = new History(undefined, undefined)
      history.base
      expect(history.base).toBe('')
    })
  })
})
