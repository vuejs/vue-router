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

  it('abort async', function (done) {
    test({
      a: {
        deactivate: function (transition) {
          setTimeout(function () {
            transition.abort()
          }, wait)
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/b')
      assertCalls(calls, ['a.deactivate'])
      // content hasn't changed yet
      expect(router.app.$el.textContent).toBe('A ')
      // path is changed
      expect(router.history.currentPath).toBe('/b')
      setTimeout(function () {
        // aborted, path is reset
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait)
    })
  })

  it('promise', function (done) {
    test({
      a: {
        deactivate: function () {
          return new Promise(function (resolve) {
            setTimeout(resolve, wait)
          })
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
      }, wait * 2)
    })
  })

  it('promise reject', function (done) {
    test({
      a: {
        deactivate: function () {
          return new Promise(function (resolve, reject) {
            setTimeout(reject, wait)
          })
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/b')
      assertCalls(calls, ['a.deactivate'])
      // content hasn't changed yet
      expect(router.app.$el.textContent).toBe('A ')
      // path is changed
      expect(router.history.currentPath).toBe('/b')
      setTimeout(function () {
        // aborted, path is reset
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait * 2)
    })
  })
})
