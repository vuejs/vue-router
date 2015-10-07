var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('canActivate', function () {

  it('sync allow', function (done) {
    test({
      a: {
        canActivate: function () {
          return true
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      assertCalls(calls, ['a.canActivate'])
      done()
    })
  })

  it('async allow', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          setTimeout(function () {
            transition.next()
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        assertCalls(calls, ['a.canActivate'])
        expect(router.app.$el.textContent).toBe('A ')
        done()
      }, wait)
    })
  })

  it('sync reject', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          return false
        }
      }
    }, function (router, calls) {
      router.go('/a')
      assertCalls(calls, ['a.canActivate'])
      expect(router.app.$el.textContent).toBe('')
      expect(router.history.currentPath).toBe('/')
      done()
    })
  })

  it('async reject', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          setTimeout(function () {
            transition.abort()
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/a')
      assertCalls(calls, ['a.canActivate'])
      expect(router.app.$el.textContent).toBe('')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/a')
      setTimeout(function () {
        // but gets reset when validation fails
        expect(router.app.$el.textContent).toBe('')
        expect(router.history.currentPath).toBe('/')
        done()
      }, wait)
    })
  })

  it('promise allow', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(true)
            }, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        assertCalls(calls, ['a.canActivate'])
        expect(router.app.$el.textContent).toBe('A ')
        done()
      }, wait * 2)
    })
  })

  it('promise resolve false', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve(false)
            }, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      assertCalls(calls, ['a.canActivate'])
      expect(router.app.$el.textContent).toBe('')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/a')
      setTimeout(function () {
        // but gets reset when validation fails
        expect(router.app.$el.textContent).toBe('')
        expect(router.history.currentPath).toBe('/')
        done()
      }, wait * 2)
    })
  })

  it('promise reject', function (done) {
    test({
      a: {
        canActivate: function (transition) {
          return new Promise(function (resolve, reject) {
            setTimeout(reject, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      assertCalls(calls, ['a.canActivate'])
      expect(router.app.$el.textContent).toBe('')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/a')
      setTimeout(function () {
        // but gets reset when validation fails
        expect(router.app.$el.textContent).toBe('')
        expect(router.history.currentPath).toBe('/')
        done()
      }, wait * 2)
    })
  })
})
