import Vue from 'vue'
import VueRouter from '../../../src/index'
import { NavigationFailureType } from '../../../src/util/errors'

Vue.use(VueRouter)

describe('error handling', () => {
  it('onReady errors', done => {
    const router = new VueRouter()
    const err = new Error('foo')
    router.beforeEach(() => {
      throw err
    })
    router.onError(() => {})

    const onReady = jasmine.createSpy('ready')
    const onError = jasmine.createSpy('error')
    const onPromiseReject = jasmine.createSpy('promise reject')
    router.onReady(onReady, onError)

    router
      .push('/')
      .catch(onPromiseReject)
      .finally(() => {
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
    router.beforeEach(() => {
      throw err
    })

    router
      .push('/foo')
      .catch(spy1)
      .finally(() => {
        expect(spy).toHaveBeenCalledWith(err)
        expect(spy1).toHaveBeenCalled()
        done()
      })
  })

  it('NavigationDuplicated error', done => {
    const router = new VueRouter()

    router.push('/foo')
    router.push('/foo').catch(err => {
      expect(err.type).toBe(NavigationFailureType.duplicated)
      expect(VueRouter.isNavigationFailure(err)).toBe(true)
      expect(
        VueRouter.isNavigationFailure(err, NavigationFailureType.duplicated)
      ).toBe(true)
      done()
    })
  })

  it('NavigationCancelled error', done => {
    const router = new VueRouter()

    router.beforeEach((to, from, next) => {
      setTimeout(() => next(), 100)
    })

    router.push('/foo').catch(err => {
      expect(err.type).toBe(NavigationFailureType.cancelled)
      done()
    })
    router.push('/')
  })

  it('NavigationCancelled error for nested async navigation', done => {
    const component = {
      template: `<img />`,
      beforeRouteEnter (to, from, next) {
        setTimeout(() => next(), 100)
      }
    }
    const router = new VueRouter({
      routes: [{ path: '/a', component }]
    })

    router.push('/a').catch(err => {
      expect(err.type).toBe(NavigationFailureType.cancelled)
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
      expect(err.type).toBe(NavigationFailureType.redirected)
      expect(err.from.path).toBe('/')
      expect(err.to.path).toBe('/foo')
      done()
    })
  })

  it('NavigationAborted error', done => {
    const router = new VueRouter()

    router.beforeEach((to, from, next) => {
      next(false)
    })

    router.push('/foo').catch(err => {
      expect(err.type).toBe(NavigationFailureType.aborted)
      done()
    })
  })

  it('async component errors', done => {
    spyOn(console, 'warn')
    const err = new Error('foo')
    const spy1 = jasmine.createSpy('error')
    const spy2 = jasmine.createSpy('error')
    const spy3 = jasmine.createSpy('promise reject')
    const Comp = () => {
      throw err
    }
    const router = new VueRouter({
      routes: [{ path: '/', component: Comp }]
    })

    router.onError(spy1)
    router.onReady(() => {}, spy2)

    router
      .push('/')
      .catch(spy3)
      .finally(() => {
        expect(spy1).toHaveBeenCalledWith(err)
        expect(spy2).toHaveBeenCalledWith(err)
        expect(spy3).toHaveBeenCalled()
        expect(console.warn).toHaveBeenCalledTimes(1)
        done()
      })
  })

  // https://github.com/vuejs/vue-router/issues/3225
  it('should trigger onReady onSuccess when redirecting', done => {
    const router = new VueRouter({
      routes: [
        { path: '/', component: {}},
        { path: '/foo', component: {}}
      ]
    })

    const onError = jasmine.createSpy('onError')
    const onReadySuccess = jasmine.createSpy('onReadySuccess')
    const onReadyFail = jasmine.createSpy('onReadyFail')
    router.onError(onError)
    router.onReady(onReadySuccess, onReadyFail)

    router.beforeEach((to, from, next) => {
      if (to.path === '/') next('/foo')
      else next()
    })

    const pushCatch = jasmine.createSpy('pushCatch')

    // initial navigation
    router
      .push('/')
      .catch(pushCatch)
      .finally(() => {
        expect(router.currentRoute.path).toBe('/foo')
        expect(onReadyFail).not.toHaveBeenCalled()
        // in 3.2.0 it was called with undefined
        // expect(pushCatch).not.toHaveBeenCalled()
        expect(onError).not.toHaveBeenCalled()
        expect(onReadySuccess).toHaveBeenCalled()
        done()
      })
  })

  it('should trigger onError if error is thrown inside redirect option', done => {
    const error = new Error('foo')
    const config = [
      {
        path: '/oldpath/:part',
        redirect: to => {
          throw error
        }
      }
    ]

    const router = new VueRouter({
      routes: config
    })

    const onError = jasmine.createSpy('onError')
    router.onError(onError)
    const pushCatch = jasmine.createSpy('pushCatch')

    router
      .push('/oldpath/test')
      .catch(pushCatch)
      .finally(() => {
        expect(pushCatch).toHaveBeenCalledWith(error)
        expect(onError).toHaveBeenCalledWith(error)
        done()
      })
  })
})
