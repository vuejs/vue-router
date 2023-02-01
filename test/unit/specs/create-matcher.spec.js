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

  it('can add nested routes', function () {
    const component = { name: 'fake' }
    const matcher = createMatcher([
      {
        path: '/p',
        name: 'parent',
        children: [
          { path: 'a', name: 'a', component },
          {
            path: 'c',
            name: 'child',
            component,
            children: [{ path: 'n', name: 'nested', component }]
          }
        ]
      },
      {
        // easier to debug tests
        path: '*', name: 'not-found', component
      }
    ])

    matcher.addRoute({ path: '/b', name: 'b', component })
    matcher.addRoute('parent', { path: 'b', name: 'p-b', component })
    matcher.addRoute('child', { path: 'b', name: 'p-c-b', component })

    expect(matcher.match('/b').name).toBe('b')
    expect(matcher.match('/p/b').name).toBe('p-b')
    expect(matcher.match('/p/c/b').name).toBe('p-c-b')
    expect(matcher.match('/p/c/n').name).toBe('nested')
  })

  it('match default child', function () {
    const component = { name: 'fake' }
    const matcher = createMatcher([
      {
        path: '/p',
        name: 'parent',
        children: [
          { path: '', name: 'parent.default', component },
          { path: 'a', name: 'parent.a', component }
        ]
      },
      { path: '*', name: 'not-found', component }
    ])
    expect(matcher.match('/p').name).toBe('parent.default')
    expect(matcher.match('/p/').name).toBe('parent.default')
    expect(matcher.match('/p/a').name).toBe('parent.a')
  })

  it('can get all routes', function () {
    const component = { name: 'fake' }
    const matcher = createMatcher([])

    expect(matcher.getRoutes()).toEqual([])

    matcher.addRoute({ path: '/b', name: 'b', component })
    expect(matcher.getRoutes().length).toBe(1)

    matcher.addRoute({ path: '/c', name: 'c', alias: ['/a', '/d'], component })
    expect(matcher.getRoutes().length).toBe(4)

    matcher.addRoute('b', { path: 'd', component })
    expect(matcher.getRoutes().length).toBe(5)

    matcher.addRoute('c', { path: 'd', component })
    expect(matcher.getRoutes().length).toBe(8)
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

  it('respect ordering', function () {
    const matcher = createMatcher([
      {
        path: '/p/staticbefore',
        name: 'staticbefore',
        component: { name: 'staticbefore' }
      },
      {
        path: '/p/:id',
        name: 'dynamic',
        component: { name: 'dynamic' }
      },
      {
        path: '/p/staticafter',
        name: 'staticafter',
        component: { name: 'staticafter' }
      }
    ])
    expect(matcher.match('/p/staticbefore').name).toBe('staticbefore')
    expect(matcher.match('/p/staticafter').name).toBe('dynamic')
  })

  it('respect ordering for full dynamic', function () {
    const matcher = createMatcher([
      {
        path: '/before/static',
        name: 'staticbefore',
        component: { name: 'staticbefore' }
      },
      {
        path: '/:foo/static',
        name: 'dynamic',
        component: { name: 'dynamic' }
      },
      {
        path: '/after/static',
        name: 'staticafter',
        component: { name: 'staticafter' }
      }
    ])
    expect(matcher.match('/before/static').name).toBe('staticbefore')
    expect(matcher.match('/after/static').name).toBe('dynamic')
  })

  it('respect ordering between full dynamic and first level static', function () {
    const matcher = createMatcher([
      {
        path: '/before/:foo',
        name: 'staticbefore',
        component: { name: 'staticbefore' }
      },
      {
        path: '/:foo/static',
        name: 'dynamic',
        component: { name: 'dynamic' }
      },
      {
        path: '/after/:foo',
        name: 'staticafter',
        component: { name: 'staticafter' }
      }
    ])
    expect(matcher.match('/before/static').name).toBe('staticbefore')
    expect(matcher.match('/after/static').name).toBe('dynamic')
  })

  it('static can use sensitive flag', function () {
    const matcher = createMatcher([
      {
        path: '/p/sensitive',
        name: 'sensitive',
        pathToRegexpOptions: {
          sensitive: true
        },
        component: { name: 'sensitive' }
      },
      {
        path: '/p/insensitive',
        name: 'insensitive',
        component: { name: 'insensitive' }
      },
      {
        path: '*', name: 'not-found', component: { name: 'not-found ' }
      }
    ])

    expect(matcher.match('/p/SENSITIVE').name).toBe('not-found')
    expect(matcher.match('/p/INSENSITIVE').name).toBe('insensitive')
  })

  it('static can use strict flag', function () {
    const matcher = createMatcher([
      {
        path: '/p/strict',
        name: 'strict',
        pathToRegexpOptions: {
          strict: true
        },
        component: { name: 'strict' }
      },
      {
        path: '/p/unstrict',
        name: 'unstrict',
        component: { name: 'unstrict' }
      },
      {
        path: '*', name: 'not-found', component: { name: 'not-found ' }
      }
    ])

    expect(matcher.match('/p/strict/').name).toBe('not-found')
    expect(matcher.match('/p/unstrict/').name).toBe('unstrict')
  })

  it('static can use end flag', function () {
    const matcher = createMatcher([
      {
        path: '/p/end',
        name: 'end',
        component: { name: 'end' }
      },
      {
        path: '/p/not-end',
        name: 'not-end',
        pathToRegexpOptions: {
          end: false
        },
        component: { name: 'not-end' }
      },
      {
        path: '*', name: 'not-found', component: { name: 'not-found ' }
      }
    ])

    expect(matcher.match('/p/end/foo').name).toBe('not-found')
    expect(matcher.match('/p/not-end/foo').name).toBe('not-end')
  })

  it('first level dynamic must work', function () {
    const matcher = createMatcher([
      {
        path: '/:foo/b',
        name: 'b',
        component: { name: 'b' }
      },
      {
        path: '/p/c',
        name: 'c',
        component: { name: 'c' }
      },
      {
        path: '*', name: 'not-found', component: { name: 'not-found ' }
      }
    ])

    expect(matcher.match('/p/b').name).toBe('b')
    expect(matcher.match('/p/c').name).toBe('c')
  })
})
