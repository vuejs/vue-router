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


const maps = createRouteMap(routes)

describe('Creating Route Map', () => {
  it('found 4 main routes', () => {
    expect(Object.keys(maps.pathMap).length).toBe(4)
    expect(Object.keys(maps.nameMap).length).toBe(4)
  })
})
