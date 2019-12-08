import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

describe('error handling', () => {
  it('onReady errors', done => {
    const router = new VueRouter()
    const err = new Error('foo')
    router.beforeEach(() => { throw err })
    router.onError(() => {})

    const onReady = jasmine.createSpy('ready')
    const onError = jasmine.createSpy('error')
    const onPromiseReject = jasmine.createSpy('promise reject')
    router.onReady(onReady, onError)

    router.push('/').catch(onPromiseReject).finally(() => {
      expect(onReady).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(err)
      expect(onPromiseReject).toHaveBeenCalled()
      done()
    })
  })

  it('navigation errors', done => {
    const router = new VueRouter()
    const err = new Error('foo')
    const spy = jasmine.createSpy('error')
    const spy1 = jasmine.createSpy('promise reject')
    router.onError(spy)

    router.push('/')
    router.beforeEach(() => { throw err })

    router.push('/foo').catch(spy1).finally(() => {
      expect(spy).toHaveBeenCalledWith(err)
      expect(spy1).toHaveBeenCalled()
      done()
    })
  })

  it('NavigationDuplicated error', done => {
    const router = new VueRouter()

    router.push('/foo')
    router.push('/foo').catch(err => {
      expect(err._type).toBe('NavigationDuplicated')
      done()
    })
  })

  it('NavigationCancelled error', done => {
    const router = new VueRouter()

    router.beforeEach((to, from, next) => {
      setTimeout(() => next(), 100)
    })

    router.push('/foo').catch(err => {
      expect(err._type).toBe('NavigationCancelled')
      done()
    })
    router.push('/')
  })

  it('NavigationRedirected error', done => {
    const router = new VueRouter()

    router.beforeEach((to, from, next) => {
      if (to.query.redirect) {
        next(to.query.redirect)
      }
    })

    router.push('/foo?redirect=/').catch(err => {
      expect(err._type).toBe('NavigationRedirected')
      done()
    })
  })

  it('NavigationAborted error', done => {
    const router = new VueRouter()

    router.beforeEach((to, from, next) => { next(false) })

    router.push('/foo').catch(err => {
      expect(err._type).toBe('NavigationAborted')
      done()
    })
  })

  it('async component errors', done => {
    spyOn(console, 'warn')
    const err = new Error('foo')
    const spy1 = jasmine.createSpy('error')
    const spy2 = jasmine.createSpy('errpr')
    const spy3 = jasmine.createSpy('promise reject')
    const Comp = () => { throw err }
    const router = new VueRouter({
      routes: [
        { path: '/', component: Comp }
      ]
    })

    router.onError(spy1)
    router.onReady(() => {}, spy2)

    router.push('/').catch(spy3).finally(() => {
      expect(spy1).toHaveBeenCalledWith(err)
      expect(spy2).toHaveBeenCalledWith(err)
      expect(spy3).toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
