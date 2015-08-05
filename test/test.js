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
    router = new Router({ abstract: true })
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
    router = new Router({ abstract: true })
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
    router = new Router({ abstract: true })
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
    router = new Router({ abstract: true })
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
      method: 'go'
    }, [
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      ['../a', 'AAA', '/a'],
      ['./../b', 'BBB', '/b'],
      // no match
      ['/c', '']
    ], done)
  })

  it('v-link', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template:
            '<div>' +
              '<a id="link-a" v-link="b">Link A</a>' +
            '</div>'
        }
      },
      '/b': {
        component: {
          template:
            '<div>' +
              '<a id="link-b" v-link="/a">Link B</a>' +
            '</div>'
        }
      }
    })
    var App = Vue.extend({
      replace: false,
      template: '<router-view></router-view>'
    })
    router.start(App, el)
    router.go('/a')
    el = router.app.$el
    nextTick(function () {
      expect(el.textContent).toBe('Link A')
      var link = el.querySelector('#link-a')
      expect(link.getAttribute('href')).toBe('b')
      link.click()
      nextTick(function () {
        expect(el.textContent).toBe('Link B')
        var link = el.querySelector('#link-b')
        expect(link.getAttribute('href')).toBe('/a')
        link.click()
        nextTick(function () {
          expect(el.textContent).toBe('Link A')
          done()
        })
      })
    })
  })

  it('v-link active classes', function (done) {
    router = new Router({
      abstract: true,
      linkActiveClass: 'active'
    })
    var App = Vue.extend({
      replace: false,
      template:
        '<a id="link-a" v-link="/a">Link A</a>' +
        '<a id="link-b" v-link="/b">Link B</a>' +
        '<router-view></router-view>'
    })
    router.start(App, el)
    router.go('/a')
    el = router.app.$el
    var linkA = el.querySelector('#link-a')
    var linkB = el.querySelector('#link-b')
    expect(linkA.className).toBe('active active-exact')
    expect(linkB.className).toBe('')
    router.go('/a/b/c')
    nextTick(function () {
      expect(linkA.className).toBe('active')
      expect(linkB.className).toBe('')
      router.go('/b')
      nextTick(function () {
        expect(linkA.className).toBe('')
        expect(linkB.className).toBe('active active-exact')
        router.go('/b/c/d')
        nextTick(function () {
          expect(linkA.className).toBe('')
          expect(linkB.className).toBe('active')
          done()
        })
      })
    })
  })

  it('v-link relative querystring', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/': {
        component: {
          template:
            '<div>' +
              '<router-view></router-view>' +
            '</div>'
        },
        subRoutes: {
          'foo': {
            component: {
              template:
                '<div>' +
                  '<a v-link="?id=1234" id="link"></a>' +
                  '{{route.query.id}}' +
                '</div>'
            }
          }
        }
      }
    })
    var App = Vue.extend({
      replace: false,
      template: '<router-view></router-view>'
    })
    router.start(App, el)
    router.go('/foo')
    nextTick(function () {
      router.app.$el.querySelector('#link').click()
      nextTick(function () {
        var text = router.app.$el.textContent
        expect(text).toBe('1234')
        done()
      })
    })
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
    router = new Router({ abstract: true })
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
      router = new Router({ abstract: true })
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
    router = new Router({ abstract: true })
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
      if (matches.length) {
        assertRoutes(options, matches, done)
      } else {
        done()
      }
    })
  }

})
