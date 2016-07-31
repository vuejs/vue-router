import { AbstractHistory } from '../../../src/history/abstract'
import VueRouter from '../../../src'

describe('History', () => {
  it('Sets name property on current route', () => {
    const router = new VueRouter({
      mode: 'history',
      routes: [
        { path: '/', name: 'home', component: {}}
      ]
    })

    const history = new AbstractHistory(router)
    expect(history.current.name).toBe('home')
  })
})
