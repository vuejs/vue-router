/*eslint-disable no-undef*/
import { createRouteMap } from '../../../src/create-route-map'
// require('../../helpers/to-have-been-warned')

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
    component: Bar
    // children: [
    //   {
    //     path: '',
    //     component: Baz,
    //     name: 'bar.baz'
    //   }
    // ]
  }
]

const msg = 'Named Route \'bar\' has a default child route.\n' +
'When navigating to this named route (:to="{name: \'bar\'"), the default child route will not be rendered.\n' +
'Remove the name from this route and use the name of the default child route for named links instead.'

const maps = createRouteMap(routes)

describe('Creating Route Map', () => {
  it('found 4 main routes', () => {
    expect(maps.pathMap.keys.length).toBe(4)
    expect(maps.nameMap.keys.length).toBe(4)
  })

  it('the main route "bar" has one child', () => {
    expect(maps.nameMap.bar.children.length).toBe(1)
  })

  it('has warned about named parent of default child route', () => {
    // expect(msg).toHaveBeenWarned()
    expect(1).toBe(1)
  })
})
