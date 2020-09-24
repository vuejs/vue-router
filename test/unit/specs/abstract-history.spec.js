import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

const delay = t => new Promise(resolve => setTimeout(resolve, t))

describe('abstract history', () => {
  it('run afterEach after initial navigation', done => {
    const router = new VueRouter({ mode: 'abstract' })
    const afterEach = jasmine.createSpy('afterEach')
    const onReady = jasmine.createSpy('ready')
    const onError = jasmine.createSpy('error')
    router.afterEach(afterEach)
    router.onReady(onReady, onError)

    router.push('/').finally(() => {
      expect(onReady).toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
      expect(afterEach).toHaveBeenCalled()
      done()
    })
  })

  it('run afterEach after router.go', done => {
    const router = new VueRouter({ mode: 'abstract' })
    const afterEach = jasmine.createSpy('afterEach')

    router
      .push('/')
      .then(() => router.push('/foo'))
      .then(() => {
        router.afterEach(afterEach)
        router.go(-1)
        return delay(30)
      })
      .finally(() => {
        expect(afterEach).toHaveBeenCalled()
        done()
      })
  })
})
