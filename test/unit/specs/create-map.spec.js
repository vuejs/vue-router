/*eslint-disable no-undef*/
import { createRouteMap } from '../../../src/create-route-map'

const Home = { template: '<div>This is Home</div>' }
const Foo = { template: '<div>This is Foo</div>' }
const FooBar = { template: '<div>This is FooBar</div>' }
const Foobar = { template: '<div>This is foobar</div>' }
const Bar = { template: '<div>This is Bar <router-view></router-view></div>' }
const Baz = { template: '<div>This is Baz</div>' }

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/foo', name: 'foo', component: Foo },
  { path: '*', name: 'wildcard', component: Baz },
  {
    path: '/bar',
    name: 'bar',
    component: Bar,
    children: [
      {
        path: '',
        component: Baz,
        name: 'bar.baz'
      }
    ]
  },
  {
    path: '/bar-redirect',
    name: 'bar-redirect',
    redirect: { name: 'bar-redirect.baz' },
    component: Bar,
    children: [
      {
        path: '',
        component: Baz,
        name: 'bar-redirect.baz'
      }
    ]
  }
]

describe('Creating Route Map', function () {
  let maps

  beforeAll(function () {
    spyOn(console, 'warn')
    maps = createRouteMap(routes)
  })

  beforeEach(function () {
    console.warn.calls.reset()
    process.env.NODE_ENV = 'production'
  })

  it('has a pathMap object for default subroute at /bar/', function () {
    expect(maps.pathMap['/bar/']).not.toBeUndefined()
  })

  it('has a pathList which places wildcards at the end', () => {
    expect(maps.pathList).toEqual([
      '',
      '/foo',
      '/bar/',
      '/bar',
      '/bar-redirect/',
      '/bar-redirect',
      '*'
    ])
  })

  it("has a nameMap object for default subroute at 'bar.baz'", function () {
    expect(maps.nameMap['bar.baz']).not.toBeUndefined()
  })

  it('in development, has logged a warning concerning named route of parent and default subroute', function () {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap(routes)
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn.calls.argsFor(0)[0]).toMatch(
      "vue-router] Named Route 'bar'"
    )
  })

  it('in development, throws if path is missing', function () {
    process.env.NODE_ENV = 'development'
    expect(() => {
      maps = createRouteMap([{ component: Bar }])
    }).toThrowError(/"path" is required/)
  })

  it('in production, it has not logged this warning', function () {
    maps = createRouteMap(routes)
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('in development, warn duplicate param keys', () => {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      {
        path: '/foo/:id',
        component: Foo,
        children: [{ path: 'bar/:id', component: Bar }]
      }
    ])
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch(
      'vue-router] Duplicate param keys in route with path: "/foo/:id/bar/:id"'
    )
  })

  it('in development, warns about alias and path having the same value', () => {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      {
        path: '/foo-alias',
        component: Foo,
        alias: '/foo-alias'
      }
    ])
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch(
      'vue-router] Found an alias with the same value as the path: "/foo-alias"'
    )
  })

  it('in development, warns about one alias (in an array) having the same value as the path', () => {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      {
        path: '/foo-alias',
        component: Foo,
        alias: ['/bar', '/foo-alias']
      }
    ])
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch(
      'vue-router] Found an alias with the same value as the path: "/foo-alias"'
    )
  })

  it('in development, warn if a path is missing a leading slash', function () {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      { path: 'bar', name: 'bar', component: Bar }
    ])
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn.calls.argsFor(0)[0]).toEqual('[vue-router] Non-nested routes must include a leading slash character. Fix the following routes: \n- bar')
  })

  it('in development, it does not log the missing leading slash when routes are valid', function () {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      { path: '/bar', name: 'bar', component: Bar }
    ])
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('in production, it does not log the missing leading slash warning', function () {
    process.env.NODE_ENV = 'production'
    maps = createRouteMap([
      { path: 'bar', name: 'bar', component: Bar }
    ])
    expect(console.warn).not.toHaveBeenCalled()
  })

  describe('path-to-regexp options', function () {
    const routes = [
      { path: '/foo', name: 'foo', component: Foo },
      { path: '/bar', name: 'bar', component: Bar, caseSensitive: false },
      {
        path: '/FooBar',
        name: 'FooBar',
        component: FooBar,
        caseSensitive: true
      },
      {
        path: '/foobar',
        name: 'foobar',
        component: Foobar,
        caseSensitive: true
      }
    ]

    it('caseSensitive option in route', function () {
      const { nameMap } = createRouteMap(routes)

      expect(nameMap.FooBar.regex.ignoreCase).toBe(false)
      expect(nameMap.bar.regex.ignoreCase).toBe(true)
      expect(nameMap.foo.regex.ignoreCase).toBe(true)
    })

    it('pathToRegexpOptions option in route', function () {
      const { nameMap } = createRouteMap([
        {
          name: 'foo',
          path: '/foo',
          component: Foo,
          pathToRegexpOptions: {
            sensitive: true
          }
        },
        {
          name: 'bar',
          path: '/bar',
          component: Bar,
          pathToRegexpOptions: {
            sensitive: false
          }
        }
      ])

      expect(nameMap.foo.regex.ignoreCase).toBe(false)
      expect(nameMap.bar.regex.ignoreCase).toBe(true)
    })

    it('caseSensitive over pathToRegexpOptions in route', function () {
      const { nameMap } = createRouteMap([
        {
          name: 'foo',
          path: '/foo',
          component: Foo,
          caseSensitive: true,
          pathToRegexpOptions: {
            sensitive: false
          }
        }
      ])

      expect(nameMap.foo.regex.ignoreCase).toBe(false)
    })

    it('keeps trailing slashes with strict mode', function () {
      const { pathList } = createRouteMap([
        {
          path: '/foo/',
          component: Foo,
          pathToRegexpOptions: {
            strict: true
          }
        },
        {
          path: '/bar/',
          component: Foo
        }
      ])

      expect(pathList).toEqual(['/foo/', '/bar'])
    })
  })
})
