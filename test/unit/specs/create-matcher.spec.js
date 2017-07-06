/*eslint-disable no-undef*/
import { createMatcher } from '../../../src/create-matcher'

const routes = [
  { path: '/', name: 'home', component: { name: 'home' }},
  { path: '/foo', name: 'foo', component: { name: 'foo' }},
  {
    path: '/async',
    name: 'async',
    loadChildren: function () {
      return Promise.resolve([
        {
          name: 'asyncBar',
          component: Foo
        }
      ])
    }
  }
]

describe('Creating Matcher', function () {
  let match

  beforeAll(function () {
    spyOn(console, 'warn')
    match = createMatcher(routes).match
  })

  beforeEach(function () {
    console.warn.calls.reset()
    process.env.NODE_ENV = 'production'
  })

  it('in development, has logged a warning if a named route does not exist', function () {
    process.env.NODE_ENV = 'development'
    const { name, matched } = match({ name: 'bar' }, routes[0])
    expect(matched.length).toBe(0)
    expect(name).toBe('bar')
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch('Route with name \'bar\' does not exist')
  })

  it('in production, it has not logged this warning', function () {
    match({ name: 'foo' }, routes[0])
    expect(console.warn).not.toHaveBeenCalled()
  })

  describe('async children', function () {
    it('should match the async route', function () {
      const { name, matched } = match({ path: '/async' }, routes[0])
      expect(matched.length).toBe(1)
      expect(name).toBe('async')
    })

    it('should match the async route ending with a slash', function () {
      const { name, matched } = match('/async/' , routes[0])
      expect(matched.length).toBe(1)
      expect(name).toBe('async')
    })

    it('should match the async route when the children have not been loaded', function () {
      const { name, matched } = match('/async/foo', routes[0])
      expect(matched.length).toBe(1)
      expect(name).toBe('async')
    })

    it('should container property loadChildren with a value of null for non-async routes', function () {
      const { loadChildren } = match('/foo', routes[0])
      expect(loadChildren).toBe(null)
    })

    it('should container property loadChildren without a value of null for async routes', function () {
      const { loadChildren } = match('/async/foo', routes[0])
      expect(loadChildren).not.toBe(null)
    })
  })
})
