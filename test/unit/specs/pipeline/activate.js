var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls
var routerUtil = require('../../../../src/util')

describe('activate', function () {

  beforeEach(function () {
    spyOn(routerUtil, 'warn')
  })

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

  it('sync (no arg)', function (done) {
    test({
      a: {
        activate: function () {
          // noop
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

  it('abort async', function (done) {
    test({
      a: {
        activate: function (transition) {
          setTimeout(function () {
            transition.abort()
          }, wait)
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      assertCalls(calls, ['a.activate'])
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

  it('promise', function (done) {
    test({
      a: {
        activate: function (transition) {
          return new Promise(function (resolve) {
            setTimeout(resolve, wait)
          })
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        assertCalls(calls, ['a.activate'])
        expect(router.app.$el.textContent).toBe('A ')
        done()
      }, wait * 2)
    })
  })

  it('promise reject', function (done) {
    test({
      a: {
        activate: function (transition) {
          return new Promise(function (resolve, reject) {
            setTimeout(reject, wait)
          })
        }
      }
    }, function (router, calls, emitter) {
      router.go('/a')
      assertCalls(calls, ['a.activate'])
      expect(router.app.$el.textContent).toBe('')
      // path changes during validation phase
      expect(router.history.currentPath).toBe('/a')
      setTimeout(function () {
        // activation error should continue transition
        expect(router.app.$el.textContent).toBe('A ')
        expect(router.history.currentPath).toBe('/a')
        done()
      }, wait * 2)
    })
  })

  it('error', function (done) {
    test({
      a: {
        activate: function (transition) {
          throw new Error('oh no')
        }
      }
    }, function (router, calls, emitter) {
      var errorThrown = jasmine.createSpy()
      try {
        router.go('/a')
      } catch (e) {
        errorThrown()
      }
      expect(routerUtil.warn).toHaveBeenCalled()
      expect(errorThrown).toHaveBeenCalled()
      // should complete the transition despite error
      assertCalls(calls, ['a.activate'])
      expect(router.app.$el.textContent).toBe('A ')
      expect(router.history.currentPath).toBe('/a')
      done()
    })
  })

  it('multiple', function (done) {
    var calls = []
    test({
      a: {
        activate: [
          function (transition) {
            calls.push(1)
            setTimeout(function () {
              transition.next()
            }, wait)
          },
          function () {
            calls.push(2)
            return new Promise(function (resolve) {
              setTimeout(resolve, wait)
            })
          }
        ]
      }
    }, function (router, _, emitter) {
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        assertCalls(calls, [1, 2])
        expect(router.app.$el.textContent).toBe('A ')
        done()
      }, wait * 3)
    })
  })
})
