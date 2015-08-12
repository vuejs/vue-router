var Vue = require('vue')
var Router = require('../../../src')
var Emitter = require('events').EventEmitter
var nextTick = Vue.nextTick

describe('Pipeline', function () {

  it('should invoke hooks in correct order', function (done) {
    function makeConfig () {
      return {
        canActivate: function () {
          return true
        },
        activate: function (transition) {
          transition.next()
        },
        canDeactivate: function () {
          return true
        },
        deactivate: function (transition) {
          transition.next()
        }
      }
    }
    test({
      a: makeConfig(),
      b: makeConfig(),
      c: makeConfig(),
      d: makeConfig()
    }, function (router, calls) {
      router.go('/a/b')
      expect(router.app.$el.textContent).toBe('A B')
      assertCalls(calls, [
        // initial render
        "a.canActivate", "b.canActivate", "a.activate", "b.activate"
      ])
      // switch
      router.go('/c/d')
      expect(router.app.$el.textContent).toBe('C D')
      assertCalls(calls, [
        // initial render
        "a.canActivate", "b.canActivate", "a.activate", "b.activate",
        // check can deactivate current views from bottom up
        "b.canDeactivate", "a.canDeactivate",
        // check can activate new views from top down
        "c.canActivate", "d.canActivate",
        // deactivate old views from bottom up
        "b.deactivate", "a.deactivate",
        // activate new views from top down
        "c.activate", "d.activate"
      ])
      done()
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
    
  })

  describe('canDeactivate', function () {
    
  })

  describe('canReuse', function () {
    
  })

  describe('data', function () {
    
  })

  describe('waitForData', function () {
    
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
          var event = route + '.' + hook
          emitter.emit(event)
          calls.push(event)
          return fn(transition)
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
