import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

describe('onReady order', () => {
  function factory () {
    const router = new VueRouter({
      mode: 'abstract',
      routes: [
        { path: '/', component: {}},
        { path: '/foo', component: {}}
      ]
    })

    return { router }
  }

  it('should trigger onReady after push with redirect', done => {
    const { router } = factory()

    let n = 0
    const count = 2
    router.onReady(() => {
      expect(router.currentRoute.path).toBe('/foo')
      if (++n === count) done()
    })

    router.beforeEach((to, from, next) => {
      if (to.path === '/') next('/foo')
      else next()
    })

    router.push('/').catch(() => {
      expect(router.currentRoute.path).toBe('/foo')
      if (++n === count) done()
    })
  })
})
