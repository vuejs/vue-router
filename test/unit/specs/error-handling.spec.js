import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

describe('error handling', () => {
  it('onReady errors', () => {
    const router = new VueRouter()
    const err = new Error('foo')
    router.beforeEach(() => { throw err })
    router.onError(() => {})

    const onReady = jasmine.createSpy('ready')
    const onError = jasmine.createSpy('error')
    router.onReady(onReady, onError)

    router.push('/')

    expect(onReady).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(err)
  })

  it('navigation errors', () => {
    const router = new VueRouter()
    const err = new Error('foo')
    const spy = jasmine.createSpy('error')
    router.onError(spy)

    router.push('/')
    router.beforeEach(() => { throw err })

    router.push('/foo')
    expect(spy).toHaveBeenCalledWith(err)
  })

  it('async component errors', () => {
    const err = new Error('foo')
    const spy1 = jasmine.createSpy('error')
    const spy2 = jasmine.createSpy('errpr')
    const Comp = () => { throw err }
    const router = new VueRouter({
      routes: [
        { path: '/', component: Comp }
      ]
    })

    router.onError(spy1)
    router.onReady(() => {}, spy2)

    router.push('/')

    expect(spy1).toHaveBeenCalledWith(err)
    expect(spy2).toHaveBeenCalledWith(err)
  })

  // #2833
  // async/await => router.beforeEach(async () => { throw err })
  // Promise => router.beforeEach(() => new Promise((resolve, reject) => reject(err)))
  describe('async/await, handle onError', () => {
    describe('Global', () => {
      let router, err, spy

      beforeEach(() => {
        router = new VueRouter()
        err = new Error('foo')
        spy = jasmine.createSpy('error')
        router.onError(spy)
      })

      const promiseError = () => new Promise((resolve, reject) => {
        reject(err)
      })

      it('beforeEach', () => {
        router.beforeEach(() => promiseError())

        router.push('/foo', () => {
          fail('onError function did not receive an error')
        }, () => {
          expect(spy).toHaveBeenCalledWith(err)
        })
      })

      it('afterEach', () => {
        router.afterEach(() => promiseError())

        router.push('/foo', () => {
          Vue.nextTick(() => expect(spy).toHaveBeenCalledWith(err))
        }, () => {
          fail('onError function did not receive an error')
        })
      })

      it('beforeResolve', () => {
        router.beforeResolve(() => promiseError())

        router.push('/foo', () => {
          fail('onError function did not receive an error')
        }, () => {
          expect(spy).toHaveBeenCalledWith(err)
        })
      })
    })
  })
})
