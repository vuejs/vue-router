/*eslint-disable no-undef*/
import { createMatcher } from '../../../src/create-matcher'

const routes = [
  { path: '/', name: 'home', component: { name: 'home' }},
  { path: '/foo', name: 'foo', component: { name: 'foo' }},
  { path: '*', props: true, component: { name: 'notFound' }}
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

  it('matches asterisk routes with a default param name', function () {
    const { params } = match({ path: '/not-found' }, routes[0])
    expect(params).toEqual({ pathMatch: '/not-found' })
  })
})
