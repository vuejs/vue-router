var testUtils = require('../util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('activate', function () {

  it('sync', function (done) {
    test({
      a: {
        activate: function (transition) {
          transition.next()
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      assertCalls(calls, ['a.activate'])
      done()
    })
  })

  it('async', function (done) {
    test({
      a: {
        activate: function (transition) {
          setTimeout(function () {
            transition.next()
          }, wait)
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        assertCalls(calls, ['a.activate'])
        expect(router.app.$el.textContent).toBe('A ')
        done()
      }, wait)
    })
  })

  it('abort sync', function (done) {
    test({
      a: {
        activate: function (transition) {
          transition.abort()
          // should have no effect
          transition.next()
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      assertCalls(calls, ['a.activate'])
      expect(router.app.$el.textContent).toBe('')
      expect(router.history.currentPath).toBe('/')
      done()
    })
  })
})
