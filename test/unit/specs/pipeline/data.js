var testUtils = require('../util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('data', function () {

  it('initial load', function (done) {
    test({
      data: {
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        done()
      }, wait * 2)
    })
  })

  it('reload', function (done) {
    test({
      data: {
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        router.go('/data/reload')
        assertCalls(calls, ['data.data', 'data.data'])
        router.app.$nextTick(function () {
          expect(router.app.$el.textContent).toBe('loading...')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('reload')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  })

  it('waitForData', function (done) {
    test({
      data: {
        waitForData: true,
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        router.go('/data/reload')
        assertCalls(calls, ['data.data', 'data.data'])
        router.app.$nextTick(function () {
          expect(router.app.$el.textContent).toBe('loading...')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('reload')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  })

})
