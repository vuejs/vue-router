var Vue = require('vue')
var Router = require('../../../src')
var Emitter = require('events').EventEmitter

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

exports.test = function (configs, cb) {
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
        calls.push(event)
        var res = typeof fn === 'function'
          ? fn(transition)
          : fn
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
        '/b': {
          component: {
            template: 'B',
            route: configs.b
          }
        },
        '/e': {
          component: {
            template: 'E'
          }
        }
      }
    },
    '/c': {
      component: {
        template: 'C <router-view></router-view>',
        route: configs.c
      },
      subRoutes: {
        '/d': {
          component: {
            template: 'D',
            route: configs.d
          }
        }
      }
    },
    '/data/:msg': {
      component: {
        route: configs.data,
        template:
          '<span v-if="$loadingRouteData">loading...</span>' +
          '<span v-if="!$loadingRouteData">{{msg}}</span>',
        data: function () {
          return {
            msg: 'default'
          }
        }
      }
    }
  })
  router.start(App, el)
  cb(router, calls, emitter)
}

exports.assertCalls = function (calls, expects) {
  expects.forEach(function (e, i) {
    expect(calls[i]).toBe(e)
  })
}
