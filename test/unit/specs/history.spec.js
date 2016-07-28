import { History } from '../../../src/history/base'
import VueRouter from '../../../src'

describe('History', () => {
  it('Sets name property on current route', () => {
    const router = new VueRouter({
      mode: 'history',
      routes: [
        { path: '/', name: 'home', component: {}}
      ]
    })

    const history = new History(router, '/')
    expect(history.current.name).toBe('home')
  })
})
