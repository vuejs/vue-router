import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

describe('Usage in Node', () => {
  it('should be in abstract mode', () => {
    const router = new VueRouter()
    expect(router.mode).toBe('abstract')
  })

  it('should be able to navigate without app instance', () => {
    const router = new VueRouter({
      routes: [
        { path: '/', component: { name: 'foo' }},
        { path: '/bar', component: { name: 'bar' }}
      ]
    })
    router.push('/bar')
    expect(router.history.current.path).toBe('/bar')
  })

  it('getMatchedComponents', () => {
    const Foo = { name: 'foo' }
    const Bar = { name: 'bar' }
    const Baz = { name: 'baz' }
    const router = new VueRouter({
      routes: [
        { path: '/', component: Foo },
        { path: '/bar', component: Bar, children: [
          { path: 'baz', component: Baz }
        ] }
      ]
    })
    expect(router.getMatchedComponents('/')).toEqual([Foo])
    expect(router.getMatchedComponents('/bar/baz')).toEqual([Bar, Baz])
  })

  it('should navigate through history with same consecutive routes in history stack', () => {
    const router = new VueRouter({
      routes: [
        { path: '/', component: { name: 'foo' }},
        { path: '/bar', component: { name: 'bar' }}
      ]
    })
    router.push('/')
    router.push('/bar')
    router.push('/')
    router.replace('/bar')
    router.back()
    expect(router.history.current.path).toBe('/bar')
    router.back()
    expect(router.history.current.path).toBe('/')
  })
})
