/*eslint-disable no-undef*/
import { createRouteMap } from '../../../src/create-route-map'

const Home = { template: '<div>This is Home</div>' }
const Foo = { template: '<div>This is Foo</div>' }
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
    expect(maps.pathList).toEqual(['', '/foo', '/bar/', '/bar', '*'])
  })

  it('has a nameMap object for default subroute at \'bar.baz\'', function () {
    expect(maps.nameMap['bar.baz']).not.toBeUndefined()
  })

  it('in development, has logged a warning concerning named route of parent and default subroute', function () {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap(routes)
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch('vue-router] Named Route \'bar\'')
  })

  it('in production, it has not logged this warning', function () {
    maps = createRouteMap(routes)
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('in development, warn duplicate param keys', () => {
    process.env.NODE_ENV = 'development'
    maps = createRouteMap([
      {
        path: '/foo/:id', component: Foo,
        children: [
          { path: 'bar/:id', component: Bar }
        ]
      }
    ])
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch('vue-router] Duplicate param keys in route with path: "/foo/:id/bar/:id"')
  })
})
