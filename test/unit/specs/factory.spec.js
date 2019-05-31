import Router from '../../../src/index'
import Vue from 'vue'

describe('router factory', () => {
  let InstancedBasedApp, FactoryBasedApp

  beforeEach(() => {
    const routerFactory = () => new Router({
      mode: 'abstract',
      routes: [
        {
          path: '/a',
          component: {
            name: 'A'
          }
        }
      ]
    })

    const router = routerFactory()

    InstancedBasedApp = Vue.extend({
      router,
      render (h) { return h('div') }
    })

    FactoryBasedApp = Vue.extend({
      router: routerFactory,
      render (h) { return h('div') }
    })
  })

  it('should initialize router from factory', () => {
    const vm = new FactoryBasedApp()
    expect(vm.$router instanceof Router).toBeTruthy()
  })

  it('should use different router instances on different app instances', () => {
    const app = new FactoryBasedApp()
    const app2 = new FactoryBasedApp()
    expect(app.$router).not.toBe(app2.$router)
  })

  it('should allow to work as normal', () => {
    const app = new InstancedBasedApp()
    const app2 = new InstancedBasedApp()
    expect(app.$router).toBe(app2.$router)
  })
})

