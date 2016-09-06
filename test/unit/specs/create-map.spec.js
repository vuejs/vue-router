/*eslint-disable no-undef*/
import { createRouteMap } from '../../../src/create-route-map'

const Home = { template: '<div>This is Home</div>' }
const Foo = { template: '<div>This is Foo</div>' }
const Bar = { template: '<div>This is Bar <router-view></router-view></div>' }
const Baz = { template: '<div>This is Baz</div>' }

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/foo', name: 'foo', component: Foo },
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
  beforeAll(function () {
    console.warn = console.warn
    spyOn(console, 'warn')
    this.maps = createRouteMap(routes)
  })

  it('has a pathMap object for default subroute at /bar/', function () {
    expect(this.maps.pathMap['/bar/']).not.toBeUndefined()
  })

  it('has a nameMap object for default subroute at \'bar.baz\'', function () {
    expect(this.maps.nameMap['bar.baz']).not.toBeUndefined()
  })

  it('has logged a waring to the console about the name of the parent and the default subroute', function () {
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn.calls.argsFor(0)[0]).toMatch('vue-router] Named Route \'bar\'')
  })
})
