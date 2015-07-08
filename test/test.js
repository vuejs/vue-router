var Vue = require('vue')
var Router = require('../src')
var nextTick = Vue.nextTick

Vue.use(Router)
// default replace to true
Vue.options.replace = true

describe('vue-router', function () {

  var router, el

  beforeEach(function () {
    el = document.createElement('div')
  })

  afterEach(function () {
    if (router) {
      router.stop()
      router = null
    }
  })

  it('matching views', function (done) {
    router = new Router()
    router.map({
      '/a': { component: 'view-a' },
      '/b': { component: 'view-b' }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>',
      components: {
        'view-a': {
          template: 'AAA'
        },
        'view-b': {
          template: 'BBB'
        }
      }
    })
    router.start(App, el)
    // PhantomJS triggers the initial popstate
    // asynchronously, so we need to wait a tick
    setTimeout(function () {
      assertRoutes({
        method: '_match'
      }, [
        ['/a', 'AAA'],
        ['/b', 'BBB'],
        ['a', 'AAA'],
        ['b', 'BBB'],
        // no match
        ['/c', '']
      ], done)
    }, 0)
  })

  it('matching nested views', function (done) {
    router = new Router()
    router.map({
      '/a': {
        component: 'view-a',
        subRoutes: {
          '/sub-a': {
            component: 'sub-view-a'
          },
          '/sub-a-2': {
            component: 'sub-view-a-2'
          }
        }
      },
      '/b': {
        component: 'view-b',
        subRoutes: {
          '/sub-b': {
            component: 'sub-view-b'
          }
        }
      }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>',
      components: {
        'view-a': {
          template: 'VIEW A <router-view></router-view>'
        },
        'view-b': {
          template: 'VIEW B <router-view></router-view>'
        },
        'sub-view-a': {
          template: 'SUB A'
        },
        'sub-view-a-2': {
          template: 'SUB A2'
        },
        'sub-view-b': {
          template: 'SUB B'
        }
      }
    })
    router.start(App, el)
    assertRoutes({
      method: '_match'
    }, [
      ['/a', 'VIEW A '],
      ['/a/sub-a', 'VIEW A SUB A'],
      ['/a/sub-a-2', 'VIEW A SUB A2'],
      ['/b/sub-b', 'VIEW B SUB B'],
      ['/b', 'VIEW B '],
      // no match
      ['/b/sub-a', '']
    ], done)
  })

  it('route context', function (done) {
    router = new Router()
    router.map({
      '/a/:id': { component: 'view-a' }
    })
    var App = Vue.extend({
      template:
        '<div>' +
          '<router-view></router-view>' +
          // context should be available in non-router-view
          // components too.
          '<view-b></view-b>' +
        '</div>',
      components: {
        'view-a': {
          template: '{{route.path}},{{route.params.id}},{{route.query.id}}|'
        },
        'view-b': {
          template: '{{route.path}},{{route.params.id}},{{route.query.id}}'
        }
      }
    })
    router.start(App, el)
    assertRoutes({
      method: '_match'
    }, [
      // no param, no match (only view-b)
      ['/a', '/a,,'],
      // params only
      ['/a/123', '/a/123,123,|/a/123,123,'],
      // params + query
      ['/a/123?id=234', '/a/123?id=234,123,234|/a/123?id=234,123,234']
    ], done)
  })

  it('router.go()', function (done) {
    router = new Router()
    router.map({
      '/a': { component: 'view-a' },
      '/b': { component: 'view-b' }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>',
      components: {
        'view-a': {
          template: 'AAA'
        },
        'view-b': {
          template: 'BBB'
        }
      }
    })
    router.start(App, el)
    assertRoutes({
      method: 'go',
      assertHash: true
    }, [
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      ['../a', 'AAA', '/a'],
      ['./../b', 'BBB', '/b'],
      // no match
      ['/c', '']
    ], done)
  })

  it('v-link', function () {
    
  })

  it('before hook', function () {
    
  })

  it('after hook', function () {
    
  })

  it('data hook (waitForData)', function () {
    
  })

  it('data hook (loading)', function () {
    
  })

  it('alias', function (done) {
    router = new Router()
    router.map({
      '/a': { component: 'view-a' },
      '/b': { component: 'view-b' }
    })
    router.alias({
      '/c/a': '/a',
      '/c/b': '/b'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>',
      components: {
        'view-a': {
          template: 'AAA'
        },
        'view-b': {
          template: 'BBB'
        }
      }
    })
    router.start(App, el)
    assertRoutes({
      method: '_match'
    }, [
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      ['/c/a', 'AAA'],
      ['/c/b', 'BBB']
    ], done)
  })

  it('multi-variable alias', function (done) {
      router = new Router()
      router.map({
        '/a/:foo': {
          component: 'view-a',
          subRoutes: {
            '/b/:bar': { component: 'view-b' },
          }
        }
      })
      router.alias({
        '/c/a/:foo/b/:bar': '/a/:foo/b/:bar'
      })
      var App = Vue.extend({
        template: '<div><router-view></router-view></div>',
        components: {
          'view-a': {
            template: '<router-view></router-view>'
          },
          'view-b': {
            template: '{{route.params.foo}}{{route.params.bar}}'
          }
        }
      })
      router.start(App, el)
      assertRoutes({
        method: '_match'
      }, [
        ['/c/a/123/b/456', '123456']
      ], done)
    })

  it('redirect', function () {
    
  })

  it('multi-variable redirect', function (done) {
    router = new Router()
    router.map({
      '/a/:foo': {
        component: 'view-a',
        subRoutes: {
          '/b/:bar': { component: 'view-b' },
        }
      }
    })
    router.redirect({
      '/c/a/:foo/b/:bar': '/a/:foo/b/:bar'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>',
      components: {
        'view-a': {
          template: '<router-view></router-view>'
        },
        'view-b': {
          template: '{{route.params.foo}}{{route.params.bar}}'
        }
      }
    })
    router.start(App, el)
    assertRoutes({
      method: '_match'
    }, [
      ['/c/a/123/b/456', '123456']
    ], done)
  })

  it('notfound', function () {
    
  })

  it('global before', function () {
    
  })

  it('global after', function () {
    
  })

  it('hashbang option', function () {
    
  })

  it('root option', function () {
    
  })

  it('respect <base>', function () {
    
  })

  function assertRoutes (options, matches, done) {
    var match = matches.shift()
    router[options.method](match[0])
    nextTick(function () {
      var text = router.app.$el.textContent
      expect(text).toBe(match[1])
      if (options.assertHash) {
        var prefix = router._hashbang ? '#!' : '#'
        var expected = prefix + (match[2] || match[0])
        expect(location.hash).toBe(expected)
      }
      if (options.assertPath) {
        expect(location.pathname + location.search).toBe(match[0])
      }
      if (matches.length) {
        assertRoutes(options, matches, done)
      } else {
        done()
      }
    })
  }

})
