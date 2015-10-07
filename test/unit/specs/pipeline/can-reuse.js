var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('canReuse', function () {

  it('allow', function (done) {
    test({
      a: {
        canReuse: true,
        activate: function (transition) {
          // just for logging calls
          transition.next()
        }
      }
    }, function (router, calls) {
      router.go('/a/b')
      expect(router.app.$el.textContent).toBe('A B')
      assertCalls(calls, ['a.activate'])
      var A = router.app.$children[0]
      router.go('/a/e')
      assertCalls(calls, ['a.activate', 'a.canReuse'])
      expect(router.app.$el.textContent).toBe('A E')
      expect(router.app.$children[0]).toBe(A)
      done()
    })
  })

  it('deny', function (done) {
    test({
      a: {
        canReuse: false,
        activate: function (transition) {
          // just for logging calls
          transition.next()
        }
      }
    }, function (router, calls) {
      router.go('/a/b')
      expect(router.app.$el.textContent).toBe('A B')
      assertCalls(calls, ['a.activate'])
      var A = router.app.$children[0]
      router.go('/a/e')
      assertCalls(calls, ['a.activate', 'a.canReuse', 'a.activate'])
      expect(router.app.$el.textContent).toBe('A E')
      expect(router.app.$children[0]).not.toBe(A)
      done()
    })
  })

  it('function allow', function (done) {
    test({
      a: {
        canReuse: function () {
          return true
        },
        activate: function (transition) {
          // just for logging calls
          transition.next()
        }
      }
    }, function (router, calls) {
      router.go('/a/b')
      expect(router.app.$el.textContent).toBe('A B')
      assertCalls(calls, ['a.activate'])
      var A = router.app.$children[0]
      router.go('/a/e')
      assertCalls(calls, ['a.activate', 'a.canReuse'])
      expect(router.app.$el.textContent).toBe('A E')
      expect(router.app.$children[0]).toBe(A)
      done()
    })
  })

  it('function deny', function (done) {
    test({
      a: {
        canReuse: function () {
          return false
        },
        activate: function (transition) {
          // just for logging calls
          transition.next()
        }
      }
    }, function (router, calls) {
      router.go('/a/b')
      expect(router.app.$el.textContent).toBe('A B')
      assertCalls(calls, ['a.activate'])
      var A = router.app.$children[0]
      router.go('/a/e')
      assertCalls(calls, ['a.activate', 'a.canReuse', 'a.activate'])
      expect(router.app.$el.textContent).toBe('A E')
      expect(router.app.$children[0]).not.toBe(A)
      done()
    })
  })
})
