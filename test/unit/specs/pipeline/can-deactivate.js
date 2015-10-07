var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls

describe('canDeactivate', function () {

  it('sync allow', function (done) {
    test({
      a: {
        canDeactivate: function () {
          return true
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      assertCalls(calls, ['a.canDeactivate'])
      expect(router.app.$el.textContent).toBe('C ')
      done()
    })
  })

  it('async allow', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          setTimeout(function () {
            transition.next()
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      assertCalls(calls, ['a.canDeactivate'])
      expect(router.app.$el.textContent).toBe('A ')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('C ')
        done()
      }, wait)
    })
  })

  it('sync reject', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          return false
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      assertCalls(calls, ['a.canDeactivate'])
      expect(router.app.$el.textContent).toBe('A ')
      done()
    })
  })

  it('async reject', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          setTimeout(function () {
            transition.abort()
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      expect(router.app.$el.textContent).toBe('A ')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/c')
      setTimeout(function () {
        // but gets reset when validation fails
        assertCalls(calls, ['a.canDeactivate'])
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait)
    })
  })

  it('promise allow', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(true)
            }, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      expect(router.app.$el.textContent).toBe('A ')
      expect(router.history.currentPath).toBe('/c')
      setTimeout(function () {
        assertCalls(calls, ['a.canDeactivate'])
        expect(router.app.$el.textContent).toBe('C ')
        expect(router.history.currentPath).toBe('/c')
        done()
      }, wait * 2)
    })
  })

  it('promise resolve false', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve(false)
            }, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      expect(router.app.$el.textContent).toBe('A ')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/c')
      setTimeout(function () {
        // but gets reset when validation fails
        assertCalls(calls, ['a.canDeactivate'])
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait * 2)
    })
  })

  it('promise reject', function (done) {
    test({
      a: {
        canDeactivate: function (transition) {
          return new Promise(function (resolve, reject) {
            setTimeout(reject, wait)
          })
        }
      }
    }, function (router, calls) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('A ')
      router.go('/c')
      expect(router.app.$el.textContent).toBe('A ')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/c')
      setTimeout(function () {
        // but gets reset when validation fails
        assertCalls(calls, ['a.canDeactivate'])
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait * 2)
    })
  })
})
