import Vue from 'vue'
import VueRouter from '../../../src/index'

describe('[Vue Instance].$route bindings', () => {
  describe('boundToSingleVueInstance', () => {
    it('updates $route on all instances', () => {
      const router = new VueRouter({
        routes: [
          { path: '/', component: { name: 'foo' }},
          { path: '/bar', component: { name: 'bar' }}
        ]
      })
      const app1 = new Vue({ router })
      const app2 = new Vue({ router })
      expect(app1.$route.path).toBe('/')
      expect(app2.$route.path).toBe('/')
      router.push('/bar')
      expect(app1.$route.path).toBe('/bar')
      expect(app2.$route.path).toBe('/bar')
    })
  })
})
