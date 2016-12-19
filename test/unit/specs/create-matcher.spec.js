/*eslint-disable no-undef*/
import { createMatcher } from '../../../src/create-matcher'

const routes = [
  { path: '/', name: 'home', component: { name: 'home' } },
  { path: '/foo', name: 'foo', component: { name: 'foo' } },
]

describe('Creating Matcher', function () {
  beforeAll(function () {
    spyOn(console, 'warn')
    this.match = createMatcher(routes)
  })
  beforeEach(function () {
    console.warn.calls.reset()
    process.env.NODE_ENV = 'production'
  })

  it('in development, has logged a warning if a named route does not exist', function () {
    process.env.NODE_ENV = 'development'
    expect(() => {
      this.match({ name: 'bar' }, routes[0]);
    }).toThrow(new TypeError('Cannot read property \'path\' of undefined'));
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch('Route with name \'bar\' does not exist');
  })
  it('in production, it has not logged this warning', function () {
    this.match({ name: 'foo' }, routes[0]);
    expect(console.warn).not.toHaveBeenCalled()
  })
})
