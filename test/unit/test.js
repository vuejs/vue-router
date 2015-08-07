var Vue = require('vue')
var Router = require('../../src')
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
    assertRoutes([
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      ['a', 'AAA'],
      ['b', 'BBB'],
      // no match
      ['/c', '']
    ], done)
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
    assertRoutes([
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
          template: '{{$route.path}},{{$route.params.id}},{{$route.query.id}}|'
        },
        'view-b': {
          template: '{{$route.path}},{{$route.params.id}},{{$route.query.id}}'
        }
      }
    })
    router.start(App, el)
    assertRoutes([
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
    assertRoutes([
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      ['../a', 'AAA', '/a'],
      ['./../b', 'BBB', '/b'],
      // no match
      ['/c', '']
    ], { method: 'go' }, done)
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
          data: function () {
            return { a: 'a' }
          },
          template:
            '<div>' +
              '<a id="link-b" v-link="/{{a}}">Link B</a>' +
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
                  '{{$route.query.id}}' +
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
    assertRoutes([
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
            '/b/:bar': { component: 'view-b' }
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
            template: '{{$route.params.foo}}{{$route.params.bar}}'
          }
        }
      })
      router.start(App, el)
      assertRoutes([
        ['/c/a/123/b/456', '123456'],
        ['/c/a/234/b/567', '234567']
      ], done)
    })

  it('redirect', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template: '<router-view></router-view>'
        },
        subRoutes: {
          '/b': {
            component: {
              template: 'hello'
            }
          },
          '/c': {
            component: {
              template: 'world'
            }
          }
        }
      }
    })
    router.redirect({
      '/whatever': '/a/b',
      '/ok': '/a/c'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/whatever', 'hello'],
      ['/ok', 'world']
    ], done)
  })

  it('multi-variable redirect', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a/:foo': {
        component: 'view-a',
        subRoutes: {
          '/b/:bar': { component: 'view-b' }
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
          template: '{{$route.params.foo}}{{$route.params.bar}}'
        }
      }
    })
    router.start(App, el)
    assertRoutes([
      ['/c/a/123/b/456', '123456'],
      ['/c/a/234/b/567', '234567']
    ], done)
  })

  it('notfound', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '*': {
        component: {
          template: 'Whaaat'
        }
      }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/notfound', 'Whaaat'],
      ['/notagain', 'Whaaat']
    ], done)
  })

  it('global before', function () {

  })

  it('global after', function () {

  })

  it('hashbang option', function () {

  })

  it('root option', function () {

  })

  // TODO route lifecycle

  function assertRoutes (matches, options, done) {
    if (typeof options === 'function') {
      done = options
      options = {}
    }
    var match = matches.shift()
    var method = options.method || '_match'
    router[method](match[0])
    nextTick(function () {
      var text = router.app.$el.textContent
      expect(text).toBe(match[1])
      if (matches.length) {
        assertRoutes(matches, options, done)
      } else {
        done()
      }
    })
  }

})
