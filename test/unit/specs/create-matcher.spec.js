/*eslint-disable no-undef*/
import { createMatcher } from '../../../src/create-matcher'

const routes = [
  { path: '/', name: 'home', component: { name: 'home' }},
  { path: '/foo', name: 'foo', component: { name: 'foo' }},
  { path: '/baz/:testparam', name: 'baz', component: { name: 'baz' }},
  { path: '/error/*', name: 'error', component: { name: 'error' }},
  { path: '*', props: true, name: 'notFound', component: { name: 'notFound' }}
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
    expect(console.warn.calls.argsFor(0)[0]).toMatch(
      "Route with name 'bar' does not exist"
    )
  })

  it('in production, it has not logged this warning', function () {
    match({ name: 'foo' }, routes[0])
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('matches named route with params without warning', function () {
    process.env.NODE_ENV = 'development'
    const { name, path, params } = match({
      name: 'baz',
      params: { testparam: 'testvalue' }
    })
    expect(console.warn).not.toHaveBeenCalled()
    expect(name).toEqual('baz')
    expect(path).toEqual('/baz/testvalue')
    expect(params).toEqual({ testparam: 'testvalue' })
  })

  it('matches asterisk routes with a default param name without warning', function () {
    process.env.NODE_ENV = 'development'
    const { params } = match(
      { name: 'notFound', params: { pathMatch: '/not-found' }},
      routes[0]
    )
    expect(console.warn).not.toHaveBeenCalled()
    expect(params).toEqual({ pathMatch: '/not-found' })
  })

  it('matches partial asterisk routes with a default param name without warning', function () {
    process.env.NODE_ENV = 'development'
    const { params, path } = match(
      { name: 'error', params: { pathMatch: 'some' }},
      routes[0]
    )
    expect(console.warn).not.toHaveBeenCalled()
    expect(params).toEqual({ pathMatch: 'some' })
    expect(path).toEqual('/error/some')
  })

  it('matches named catch-all route with empty pathMath param without warning', function () {
    process.env.NODE_ENV = 'development'
    match(
      { name: 'notFound', params: { pathMatch: '' }},
      routes[0]
    )
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('matches asterisk routes with a default param name', function () {
    const { params } = match({ path: '/not-found' }, routes[0])
    expect(params).toEqual({ pathMatch: '/not-found' })
  })

  it('allows an empty pathMatch', function () {
    process.env.NODE_ENV = 'development'
    const pathForErrorRoute = match(
      { name: 'error', params: { pathMatch: '' }},
      routes[0]
    ).path
    const pathForNotFoundRoute = match(
      { name: 'notFound', params: { pathMatch: '' }},
      routes[0]
    ).path

    expect(console.warn).not.toHaveBeenCalled()
    expect(pathForErrorRoute).toEqual('/error/')
    expect(pathForNotFoundRoute).toEqual('/')
  })
})
