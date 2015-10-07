var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls
var util = require('../../../../src/util')

describe('full', function () {

  beforeEach(function () {
    spyOn(util, 'warn')
  })

  it('should call hooks in correct order', function (done) {
    function makeConfig () {
      return {
        canActivate: function () {
          // sync boolean
          return true
        },
        activate: function (transition) {
          // async call next()
          setTimeout(function () {
            transition.next()
            // multiple call should warn and not mess up
            // the flow
            transition.next()
          }, wait)
        },
        canDeactivate: function () {
          // promise boolean
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve(true)
            }, wait)
          })
        },
        deactivate: function (transition) {
          // promise next
          return new Promise(function (resolve, reject) {
            setTimeout(resolve, wait)
          })
        }
      }
    }

    test({
      a: makeConfig(),
      b: makeConfig(),
      c: makeConfig(),
      d: makeConfig()
    }, function (router, calls, emitter) {

      router.go('/a/b')
      emitter.once('b.activate', function () {
        assertCalls(calls, [
          // initial render
          'a.canActivate', 'b.canActivate', 'a.activate', 'b.activate'
        ])
        // should not render yet
        expect(router.app.$el.textContent).toBe('')
        // wait until activation to assert render content
        setTimeout(function () {
          expect(util.warn.calls.count()).toBe(2)
          expect(util.warn).toHaveBeenCalledWith('transition.next() should be called only once.')
          expect(router.app.$el.textContent).toBe('A B')
          router.go('/c/d')
        }, wait)
      })

      emitter.once('d.activate', function () {
        testUtils.assertCalls(calls, [
          // initial render
          'a.canActivate', 'b.canActivate', 'a.activate', 'b.activate',
          // check can deactivate current views from bottom up
          'b.canDeactivate', 'a.canDeactivate',
          // check can activate new views from top down
          'c.canActivate', 'd.canActivate',
          // deactivate old views from bottom up
          'b.deactivate', 'a.deactivate',
          // activate new views from top down
          'c.activate', 'd.activate'
        ])
        // should not switch yet
        expect(router.app.$el.textContent).toBe('A B')
        // wait until activation to assert render content
        setTimeout(function () {
          expect(util.warn.calls.count()).toBe(4)
          expect(router.app.$el.textContent).toBe('C D')
          done()
        }, wait)
      })
    })
  })
})
