var Vue = require('vue')
var Router = require('../../../src')
var util = require('../../../src/util')
var Emitter = require('events').EventEmitter
var wait = 16

describe('Pipeline', function () {

  beforeEach(function () {
    spyOn(util, 'warn')
  })

  it('should invoke hooks in correct order', function (done) {
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
        assertCalls(calls, [
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

  describe('activate', function () {
    // should be called
    // should wait until it is done before switching
  })

  describe('deactivate', function () {
    // should be called when navigated away
    // should wait until it is done before switching
  })

  describe('canActivate', function () {
    // TODO
  })

  describe('canDeactivate', function () {
    // TODO
  })

  describe('canReuse', function () {
    // TODO
  })

  describe('data', function () {
    // TODO
  })

  describe('waitForData', function () {
    // TODO
  })

  /**
   * Setup a router app for testing with two nested routes:
   *
   * - /a/b
   * - /c/d
   *
   * @param {Object} configs - an object that contains the
   *                           route configs for each component.
   * @param {Function} cb(router, calls, emitter)
   */

  function test (configs, cb) {
    var emitter = new Emitter()
    var router = new Router({ abstract: true })
    var el = document.createElement('div')
    var App = Vue.extend({ template: '<div><router-view></router-view></div>' })
    var calls = []
    // wrap hooks
    Object.keys(configs).forEach(function (route) {
      var config = configs[route]
      Object.keys(config).forEach(function (hook) {
        var fn = config[hook]
        config[hook] = function (transition) {
          var res = fn(transition)
          var event = route + '.' + hook
          calls.push(event)
          emitter.emit(event)
          return res
        }
      })
    })
    router.map({
      '/a': {
        component: {
          template: 'A <router-view></router-view>',
          route: configs.a
        },
        subRoutes: {
          '/b': { component: {
            template: 'B',
            route: configs.b
          }}
        }
      },
      '/c': {
        component: {
          template: 'C <router-view></router-view>',
          route: configs.c
        },
        subRoutes: {
          '/d': { component: {
            template: 'D',
            route: configs.d
          }}
        }
      }
    })
    router.start(App, el)
    cb(router, calls, emitter)
  }

  function assertCalls (calls, expects) {
    expects.forEach(function (e, i) {
      expect(calls[i]).toBe(e)
    })
  }
})
