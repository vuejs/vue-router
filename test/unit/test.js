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
      '/a': { component: { template: 'AAA' }},
      '/b': { component: { template: 'BBB' }}
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/a', 'AAA'],
      ['/b', 'BBB'],
      // relative
      ['a', 'AAA'],
      ['b', 'BBB'],
      // relative with traversal
      ['../a', 'AAA', '/a'],
      ['./../b', 'BBB', '/b'],
      // no match
      ['/c', '']
    ], done)
  })

  it('matching nested views', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template: 'VIEW A <router-view></router-view>'
        },
        subRoutes: {
          '/sub-a': {
            component: {
              template: 'SUB A'
            }
          },
          '/sub-a-2': {
            component: {
              template: 'SUB A2'
            }
          },
          '*': {
            component: {
              template: 'SUB A DEFAULT'
            }
          }
        }
      },
      '/b': {
        component: {
          template: 'VIEW B <router-view></router-view>'
        },
        subRoutes: {
          '/sub-b': {
            component: {
              template: 'SUB B'
            }
          }
        }
      }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/a', 'VIEW A SUB A DEFAULT'],
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
      '/a/:id': {
        component: {
          template: '{{$route.path}},{{$route.params.id}},{{$route.query.id}}|'
        }
      }
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
      ['/a/123?id=234', '/a/123?id=234,123,234|/a/123?id=234,123,234'],
      // relative query
      ['?id=345', '/a/123?id=345,123,345|/a/123?id=345,123,345']
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
          data: function () {
            return { a: 'a' }
          },
          template:
            '<div>' +
              '<a id="link-b" v-link="/{{a}}">Link B</a>' +
              '<a id="link-c" v-link="{{c}}"></c>' +
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
        // falsy expressions should not set href
        expect(el.querySelector('#link-c').hasAttribute('href')).toBe(false)
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
    el = router.app.$el
    var linkA = el.querySelector('#link-a')
    var linkB = el.querySelector('#link-b')
    router.go('/a')
    nextTick(function () {
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
      '/a': { component: { template: 'AAA' }},
      '/b': { component: { template: 'BBB' }}
    })
    router.alias({
      '/c/a': '/a',
      '/c/b': '/b'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
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
          component: {
            template: '<router-view></router-view>'
          },
          subRoutes: {
            '/b/:bar': {
              component: {
                template: '{{$route.params.foo}}{{$route.params.bar}}'
              }
            }
          }
        }
      })
      router.alias({
        '/c/a/:foo/b/:bar': '/a/:foo/b/:bar'
      })
      var App = Vue.extend({
        template: '<div><router-view></router-view></div>'
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
        component: {
          template: '<router-view></router-view>'
        },
        subRoutes: {
          '/b/:bar': {
            component: {
              template: '{{$route.params.foo}}{{$route.params.bar}}'
            }
          }
        }
      }
    })
    router.redirect({
      '/c/a/:foo/b/:bar': '/a/:foo/b/:bar'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
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
    expect(router.app.$el.textContent).toBe('Whaaat')
    assertRoutes([
      ['/notfound', 'Whaaat'],
      ['/notagain', 'Whaaat']
    ], done)
  })

  it('global before', function (done) {
    router = new Router({ abstract: true })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.map({
      '*': {
        component: {
          template: '<p>default</p>'
        }
      }
    })
    var spy = jasmine.createSpy()
    router.beforeEach(function (transition) {
      spy()
      if (transition.to.path === '/no') {
        setTimeout(function () {
          transition.abort()
          next()
        }, 100)
      } else {
        transition.next()
      }
    })
    router.start(App, el)
    expect(spy).toHaveBeenCalled()
    expect(router.app.$el.textContent).toBe('default')
    router.go('/no')
    function next () {
      expect(router.app.$el.textContent).toBe('default')
      done()
    }
  })

  // TODO route lifecycle

  function assertRoutes (matches, options, done) {
    if (typeof options === 'function') {
      done = options
      options = {}
    }
    var match = matches.shift()
    router.go(match[0])
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
