import { resolveProps } from '../../../src/util/props'

describe('Props utils', () => {
  describe('resolveProps', () => {
    beforeAll(() => {
      spyOn(console, 'warn')
    })

    it('undefined', () => {
      const result = resolveProps()
      expect(result).toBeUndefined()
    })

    it('object', () => {
      const result = resolveProps(null, { test: 'yes' })
      expect(result).toEqual({ test: 'yes' })
    })

    it('function', () => {
      const result = resolveProps(null, () => ({ test: 'yes' }))
      expect(result).toEqual({ test: 'yes' })
    })

    it('true (inherit route params)', () => {
      const result = resolveProps({ params: { test: 'yes' }}, true)
      expect(result).toEqual({ test: 'yes' })
    })

    it('false', () => {
      const result = resolveProps({ params: { test: 'yes' }}, false)
      expect(result).toBeUndefined()
    })

    it('warns on unsuported type', () => {
      resolveProps({ params: { test: 'yes' }}, 0)
      expect(console.warn).toHaveBeenCalled()
      expect(console.warn.calls.argsFor(0)[0]).toMatch('vue-router] props in ')
    })
  })
})
