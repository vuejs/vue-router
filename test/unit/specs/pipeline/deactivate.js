var testUtils = require('../util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('deactivate', function () {

  it('sync', function (done) {
    test({
      a: {
        deactivate: function (transition) {
          transition.next()
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/b')
      expect(router.app.$el.textContent).toBe('')
      assertCalls(calls, ['a.deactivate'])
      done()
    })
  })

  it('async', function (done) {
    test({
      a: {
        deactivate: function (transition) {
          setTimeout(function () {
            transition.next()
          }, wait)
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/b')
      expect(router.app.$el.textContent).toBe('A ')
      setTimeout(function () {
        assertCalls(calls, ['a.deactivate'])
        expect(router.app.$el.textContent).toBe('')
        done()
      }, wait)
    })
  })

  it('abort sync', function (done) {
    test({
      a: {
        deactivate: function (transition) {
          transition.abort()
          // should have no effect
          transition.next()
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/b')
      assertCalls(calls, ['a.deactivate'])
      expect(router.app.$el.textContent).toBe('A ')
      done()
    })
  })
})
