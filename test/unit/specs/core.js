var Vue = require('vue')
var Router = require('../../../src')
var nextTick = Vue.nextTick

describe('Core', function () {

  var router, el

  beforeEach(function () {
    el = document.createElement('div')
    document.body.appendChild(el)
    spyOn(window, 'scrollTo')
    spyOn(console, 'error')
  })

  afterEach(function () {
    var el = router && router.app.$el
    if (el && document.body.contains(el)) {
      document.body.removeChild(el)
    }
  })

  it('call Vue constructor with no arguments', function () {
    /* eslint-disable no-new */
    expect(function () {
      new Vue()
    }).not.toThrow()
    /* eslint-enable no-new */
  })

  it('matching views', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': { component: {
        template: 'AAA',
        data: function () {
          expect(this.$route).toBeTruthy()
        }
      }},
      '/b': { component: { template: 'BBB' }}
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    var cb = jasmine.createSpy()
    router.start(App, el, function () {
      expect(router.app).toBeTruthy()
      cb()
    })
    expect(cb).toHaveBeenCalled()
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

  it('go() with object', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a/:msg': {
        name: 'a',
        component: { template: 'A{{$route.params.msg}}' }
      },
      '/b/:msg': {
        name: 'b',
        component: { template: 'B{{$route.params.msg}}{{$route.query.msg}}<router-view></router-view>' },
        subRoutes: {
          '/c': {
            component: { template: 'C' }
          }
        }
      }
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      [{ path: '/a/A' }, 'AA'],
      [{ path: '/b/B' }, 'BB'],
      // relative
      [{ path: '../a/A' }, 'AA'],
      [{ path: '../b/B' }, 'BB'],
      // relative with append: true
      [{ path: 'c', append: true }, 'BBC'],
      // named routes
      [{ name: 'a', params: {msg: 'A'}}, 'AA'],
      [{ name: 'b', params: {msg: 'B'}, query: {msg: 'B'}}, 'BBB']
    ], done)
  })

  it('go () querystring coding', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: { template: 'A{{$route.query.msg}}' }
      },
      '/b': {
        name: 'b',
        component: { template: 'B{{$route.query.msg}}' }
      },
      '/c': {
        component: { template: 'C{{$route.query.msg}}' }
      }
    })
    var App = Vue.extend({
      replace: false,
      template: '<router-view></router-view>'
    })
    var query = {msg: 'https://www.google.com/#q=vuejs'}
    router.start(App, el)
    assertRoutes([
      // object with path
      [{ path: '/a', query: query }, 'A' + query.msg],
      // object with named route
      [{ name: 'b', query: query }, 'B' + query.msg],
      // special char
      ['/c?msg=%!!!', 'C%!!!']
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
          '/': {
            component: {
              template: 'SUB A DEFAULT'
            }
          },
          '/sub-a': {
            component: {
              template: 'SUB A'
            }
          },
          '/sub-a-2': {
            component: {
              template: 'SUB A2'
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

  it('matching nested views with keep-alive', function (done) {
    router = new Router({ abstract: true })
    var spyA = jasmine.createSpy()
    var spySubA = jasmine.createSpy()
    router.map({
      '/a': {
        component: {
          template: 'VIEW A <router-view></router-view>',
          created: spyA
        },
        subRoutes: {
          '/': {
            component: {
              template: 'SUB A DEFAULT'
            }
          },
          '/sub-a': {
            component: {
              template: 'SUB A'
            }
          },
          '/sub-a-2': {
            component: {
              template: 'SUB A2',
              created: spySubA
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
      template: '<div><router-view keep-alive></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/a', 'VIEW A SUB A DEFAULT'],
      ['/a/sub-a', 'VIEW A SUB A'],
      ['/a/sub-a-2', 'VIEW A SUB A2'],
      ['/b/sub-b', 'VIEW B SUB B'],
      // revisit a kept-alive view
      ['/a/sub-a-2', 'VIEW A SUB A2'],
      ['/b', 'VIEW B '],
      // no match
      ['/b/sub-a', '']
    ], function () {
      expect(spyA.calls.count()).toBe(1)
      expect(spySubA.calls.count()).toBe(1)
      done()
    })
  })

  it('route context', function (done) {
    Vue.config.silent = true
    router = new Router({ abstract: true })
    router.map({
      '/a/:id': {
        customField: 'custom',
        component: {
          template: '{{$route.path}},{{$route.params.id}},{{$route.query.id}},{{$route.customField}}|'
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
          template: '{{$route.path}},{{$route.params.id}},{{$route.query.id}},{{$route.customField}}'
        }
      }
    })
    router.start(App, el)
    assertRoutes([
      // no param, no match (only view-b)
      ['/a', '/a,,,'],
      // params only
      ['/a/123', '/a/123,123,,custom|/a/123,123,,custom'],
      // params + query
      ['/a/123?id=234', '/a/123?id=234,123,234,custom|/a/123?id=234,123,234,custom'],
      // relative query
      ['?id=345', '/a/123?id=345,123,345,custom|/a/123?id=345,123,345,custom']
    ], function () {
      Vue.config.silent = false
      done()
    })
  })

  it('v-link', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template:
            '<div>' +
              '<a id="link-a" v-link="{ path: \'b\', query: { id: 123 }}">Link A</a>' +
            '</div>'
        }
      },
      '/b': {
        component: {
          data: function () {
            return { a: 'a?a=1' }
          },
          template:
            '<div>' +
              '<a id="link-b" v-link="{ path: \'/\' + a, query: { b: 2 }}">Link B</a>' +
              '<a id="link-c" v-link="{ path: c }"></c>' +
            '</div>'
        }
      },
      // test v-link with relative path + append
      '/c': {
        component: { template:
          '<a id="link-c" v-link="{ path: \'d\', append: true }">Link C</a><router-view></router-view>' +
          '<a id="link-null" v-link="{ path: null }"></a>'
        },
        subRoutes: {
          '/d': {
            component: { template: '+D' }
          }
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
      expect(link.getAttribute('href')).toBe('b?id=123')
      click(link)
      nextTick(function () {
        expect(el.textContent).toBe('Link B')
        var link = el.querySelector('#link-b')
        expect(link.getAttribute('href')).toBe('/a?a=1&b=2')
        // falsy expressions should not set href
        expect(el.querySelector('#link-c').hasAttribute('href')).toBe(false)
        click(link)
        nextTick(function () {
          expect(el.textContent).toBe('Link A')
          router.go('/c')
          nextTick(function () {
            expect(el.textContent).toBe('Link C')
            var nullLink = el.querySelector('#link-null')
            click(nullLink)
            nextTick(function () {
              expect(el.textContent).toBe('Link C')
              var link = el.querySelector('#link-c')
              click(link)
              nextTick(function () {
                expect(el.textContent).toBe('Link C+D')
                done()
              })
            })
          })
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
      data: function () {
        return { className: 'a b c' }
      },
      template:
        '<a id="link-a" v-link="{ path: \'/a\' }">Link A</a>' +
        '<a id="link-b" v-link="{ path: \'/b\', activeClass: className }">Link B</a>' +
        '<a id="link-c" v-link="{ path: \'/\', exact: true }">Link C</a>' +
        '<router-view></router-view>'
    })
    router.start(App, el)
    el = router.app.$el
    var linkA = el.querySelector('#link-a')
    var linkB = el.querySelector('#link-b')
    var linkC = el.querySelector('#link-c')
    expect(linkA.className).toBe('')
    expect(linkB.className).toBe('')
    expect(linkC.className).toBe('active')
    router.go('/a?a=123')
    nextTick(function () {
      expect(linkA.className).toBe('active')
      expect(linkB.className).toBe('')
      expect(linkC.className).toBe('')
      router.go('/a/b/c')
      nextTick(function () {
        expect(linkA.className).toBe('active')
        expect(linkB.className).toBe('')
        expect(linkC.className).toBe('')
        router.go('/b')
        nextTick(function () {
          expect(linkA.className).toBe('')
          expect(linkB.className).toBe('a b c')
          expect(linkC.className).toBe('')
          router.app.className = 'd e'
          router.go('/b/c/d')
          nextTick(function () {
            expect(linkA.className).toBe('')
            expect(linkB.className).toBe('d e')
            expect(linkC.className).toBe('')
            router.go('/bcd')
            nextTick(function () {
              // #114 should not match
              expect(linkA.className).toBe('')
              expect(linkB.className).toBe('')
              expect(linkC.className).toBe('')
              done()
            })
          })
        })
      })
    })
  })

  it('v-link active classes with named routes', function (done) {
    router = new Router({
      abstract: true,
      linkActiveClass: 'active'
    })
    router.map({
      '/a/:id': {
        component: {},
        subRoutes: {
          'b/:bid': {
            name: 'b',
            component: {}
          }
        }
      }
    })
    var App = Vue.extend({
      replace: false,
      data: function () {
        return { className: 'custom' }
      },
      template:
        '<a id="link" v-link="{ name: \'b\', params: { id: 1, bid: 2 }}">Link A</a>' +
        '<router-view></router-view>'
    })
    router.start(App, el)
    el = router.app.$el
    var link = el.querySelector('#link')
    expect(link.className).toBe('')
    router.go('/a/1/b/1')
    nextTick(function () {
      expect(link.className).toBe('')
      router.go({ name: 'b', params: { bid: 2 }})
      nextTick(function () {
        expect(link.className).toBe('active')
        expect(router._currentRoute.path).toBe('/a/1/b/2')
        done()
      })
    })
  })

  it('v-link active classes with v-link-active', function (done) {
    router = new Router({
      abstract: true,
      linkActiveClass: 'active'
    })
    var App = Vue.extend({
      replace: false,
      components: {
        test: {
          template: '<a><slot></slot></a>'
        }
      },
      template:
        '<ul>' +
          '<li id="link-a" v-link-active>' +
            '<a v-link="{ path: \'/a\' }">Link A</a>' +
          '</li>' +
          '<li id="link-b" v-link-active>' +
            '<a v-if="true" v-link="{ path: \'/b\' }">Link B</a>' +
          '</li>' +
          '<li id="link-c" v-link-active>' +
            '<test v-link="{ path: \'/c\' }">Link C</test>' +
          '</li>' +
        '</ul>'
    })
    router.start(App, el)
    el = router.app.$el
    var linkA = el.querySelector('#link-a')
    var linkB = el.querySelector('#link-b')
    var linkC = el.querySelector('#link-c')
    expect(linkA.className).toBe('')
    expect(linkB.className).toBe('')
    expect(linkC.className).toBe('')
    router.go('/a')
    nextTick(function () {
      expect(linkA.className).toBe('active')
      expect(linkB.className).toBe('')
      expect(linkC.className).toBe('')
      router.go('/b')
      nextTick(function () {
        expect(linkA.className).toBe('')
        expect(linkB.className).toBe('active')
        expect(linkC.className).toBe('')
        router.go('/c')
        nextTick(function () {
          expect(linkA.className).toBe('')
          expect(linkB.className).toBe('')
          expect(linkC.className).toBe('active')
          done()
        })
      })
    })
  })

  it('multiple nested v-link-active', function (done) {
    router = new Router({
      abstract: true,
      linkActiveClass: 'active'
    })
    var App = Vue.extend({
      replace: false,
      template:
        '<div v-link-active class="outer">' +
          '<div v-link-active class="inner">' +
            '<a v-link="{ path: \'/a\'}">Link A</a>' +
          '</div>' +
        '</div>'
    })
    router.start(App, el)
    el = router.app.$el
    var outer = el.querySelector('.outer')
    var inner = el.querySelector('.inner')
    expect(outer.className).toBe('outer')
    expect(inner.className).toBe('inner')
    router.go('/a')
    nextTick(function () {
      expect(outer.className).toBe('outer active')
      expect(inner.className).toBe('inner active')
      done()
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
                  '<a v-link="{ path: \'?id=1234\' }" id="link"></a>' +
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
      click(router.app.$el.querySelector('#link'))
      nextTick(function () {
        var text = router.app.$el.textContent
        expect(text).toBe('1234')
        done()
      })
    })
  })

  it('v-link delegate', function (done) {
    // Safari and PhantomJS only propagates events if the
    // element is in the DOM!
    document.body.appendChild(el)
    router = new Router({ abstract: true })
    router.map({
      '/': {
        component: {
          template: '<div>Home</div>'
        }
      },
      '/foo': {
        component: {
          data: function () {
            return { home: '<a href="/">Link Home</a>' }
          },
          template: '<div id="wrap" v-html="home" v-link></div>'
        }
      }
    })
    var App = Vue.extend({
      replace: false,
      template: '<router-view></router-view>'
    })
    router.start(App, el)
    el = router.app.$el
    router.go('/foo')
    nextTick(function () {
      click(el.querySelector('#wrap a'))
      nextTick(function () {
        var text = router.app.$el.textContent
        expect(text).toBe('Home')
        document.body.removeChild(el)
        done()
      })
    })
  })

  it('v-link delegate on non-anchor', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template: 'hello'
        }
      }
    })
    router.start({
      replace: false,
      template:
        '<div v-link><a href="/a"><span id="link"></span></a></div>' +
        '<router-view></router-view>'
    }, el)
    var link = el.querySelector('#link')
    click(link)
    nextTick(function () {
      expect(el.textContent).toBe('hello')
      done()
    })
  })

  it('v-link with v-on', function (done) {
    router = new Router({ abstract: true })
    router.map({
      '/a': {
        component: {
          template: '<div>foo</div>'
        }
      }
    })
    var spy = jasmine.createSpy('v-on:click')
    var App = Vue.extend({
      replace: false,
      template:
        '<a id="link-a" v-link="{ path: \'/a\' }" v-on:click="onClick"></a>' +
        '<router-view></router-view>',
      methods: {
        onClick: spy
      }
    })
    router.start(App, el)
    el = router.app.$el
    expect(el.textContent).toBe('')
    click(el.querySelector('#link-a'))
    nextTick(function () {
      expect(spy).toHaveBeenCalled()
      expect(el.textContent).toBe('foo')
      done()
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
              template: '{{$route.query.msg}}'
            }
          }
        }
      }
    })
    router.redirect({
      '/whatever': '/a/b',
      '/ok': '/a/c',
      '*': '/a/b'
    })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.start(App, el)
    assertRoutes([
      ['/whatever', 'hello'],
      ['/ok?msg=world', 'world'],
      ['/fesfsefsef', 'hello']
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
      '/no': {
        component: {
          template: '<p>NO</p>'
        }
      },
      'redirect/:id': {
        component: {
          template: 'should never show'
        }
      },
      '/to/:id': {
        component: {
          template: 'to {{$route.params.id}}'
        }
      },
      '*': {
        component: {
          template: '<p>default</p>'
        }
      }
    })

    var spy1 = jasmine.createSpy('before hook 1')
    router.beforeEach(function (transition) {
      spy1()
      setTimeout(function () {
        transition.next()
      }, wait)
    })

    var spy2 = jasmine.createSpy('before hook 2')
    router.beforeEach(function (transition) {
      spy2()
      if (transition.to.path === '/no') {
        setTimeout(function () {
          transition.abort()
          next()
        }, wait)
      } else if (transition.to.path.indexOf('/redirect') > -1) {
        setTimeout(function () {
          transition.redirect('/to/:id')
          next2()
        }, wait)
      } else {
        transition.next()
      }
    })

    // a synchronous hook
    var spy3 = jasmine.createSpy('before hook 3')
    router.beforeEach(function () {
      spy3()
    })

    router.start(App, el)
    expect(spy1).toHaveBeenCalled()
    expect(spy2).not.toHaveBeenCalled()
    expect(spy3).not.toHaveBeenCalled()
    expect(router.app.$el.textContent).toBe('')

    setTimeout(function () {
      expect(spy2).toHaveBeenCalled()
      expect(spy3).toHaveBeenCalled()
      expect(router.app.$el.textContent).toBe('default')
      router.go('/no')
    }, wait * 2)

    function next () {
      expect(spy1.calls.count()).toBe(2)
      expect(spy2.calls.count()).toBe(2)
      expect(spy3.calls.count()).toBe(1) // aborted at 2
      expect(router.app.$el.textContent).toBe('default')
      router.go('/redirect/12345')
    }

    function next2 () {
      expect(spy1.calls.count()).toBe(4) // go + redirect
      expect(spy2.calls.count()).toBe(3) // only go at this moment
      expect(spy3.calls.count()).toBe(1) // still 1
      setTimeout(function () {
        expect(spy1.calls.count()).toBe(4)
        expect(spy2.calls.count()).toBe(4)
        expect(spy3.calls.count()).toBe(2) // after redirect
        expect(router.app.$el.textContent).toBe('to 12345')
        done()
      }, wait * 2)
    }
  })

  it('global after', function (done) {
    router = new Router({ abstract: true })
    var App = Vue.extend({
      template: '<div><router-view></router-view></div>'
    })
    router.map({
      '/a': {
        component: {
          template: '<p>a</p>'
        }
      }
    })
    var callCount = 0
    router.afterEach(function (transition) {
      if (callCount === 0) {
        // initial match
        expect(transition.from.path).toBeUndefined()
        expect(transition.to.path).toBe('/')
      } else {
        // second match
        expect(transition.from.path).toBe('/')
        expect(transition.to.path).toBe('/a')
        done()
      }
      callCount++
    })
    router.start(App, el)
    router.go('/a')
  })

  it('transitionOnLoad option', function (done) {
    router = new Router({
      abstract: true,
      transitionOnLoad: true
    })
    router.map({
      '/': {
        component: {
          template: '<p>whatever</p>'
        }
      }
    })
    var spy = jasmine.createSpy()
    var App = Vue.extend({
      template: '<div><router-view transition="test"></router-view></div>',
      transitions: {
        test: {
          enter: function (el, cb) {
            expect(el.tagName).toBe('P')
            spy()
            cb()
          }
        }
      }
    })
    // ensure el is inDoc otherwise transition won't trigger
    document.body.appendChild(el)
    router.start(App, el)
    nextTick(function () {
      expect(spy).toHaveBeenCalled()
      router.app.$destroy(true)
      done()
    })
  })

  if (!isIE9) {
    it('saveScrollPosition', function (done) {
      router = new Router({
        history: true,
        saveScrollPosition: true
      })
      router.map({
        '/a': { component: { template: 'hi' }}
      })
      router.start(Vue.extend({}), el)
      // record
      var x = window.pageXOffset
      var y = window.pageYOffset
      router.go('/a')
      nextTick(function () {
        window.addEventListener('popstate', function onPop () {
          nextTick(function () {
            expect(window.scrollTo).toHaveBeenCalledWith(x, y)
            window.removeEventListener('popstate', onPop)
            router.stop()
            done()
          })
        })
        history.back()
      })
    })

    it('slide to anchor', function (done) {
      router = new Router({
        history: true
      })
      router.map({
        '/a': { component: { template: '<a id="anchor">link</a>' }}
      })
      document.body.appendChild(el)
      router.start(Vue.extend({
        template: '<router-view></router-view>'
      }), el)
      router.go('/a#anchor')
      nextTick(function () {
        var anchor = document.getElementById('anchor')
        var x = window.scrollX
        var y = anchor.offsetTop
        expect(window.scrollTo).toHaveBeenCalledWith(x, y)
        router.stop()
        router.app.$destroy(true)
        window.addEventListener('popstate', function onPop () {
          window.removeEventListener('popstate', onPop)
          done()
        })
        history.back()
      })
    })

    it('async component', function (done) {
      router = new Router({
        abstract: true
      })
      router.map({
        '/a': {
          component: function (resolve) {
            setTimeout(function () {
              resolve({
                template: 'hello!'
              })
            }, wait)
          }
        }
      })
      router.start(Vue.extend({
        template: '<div><router-view></router-view></div>'
      }), el)
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello!')
        done()
      }, wait * 2)
    })

    it('async component abort', function (done) {
      var spy = jasmine.createSpy('async-component-abort')
      router = new Router({
        abstract: true
      })
      router.map({
        '/a': {
          component: function (resolve) {
            setTimeout(function () {
              resolve({
                template: 'hello!',
                created: spy
              })
            }, wait)
          }
        },
        '/b': {
          component: {
            template: 'B'
          }
        }
      })
      router.start(Vue.extend({
        template: '<div><router-view></router-view></div>'
      }), el)
      router.go('/a')
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        router.go('/b')
        setTimeout(function () {
          expect(router.app.$el.textContent).toBe('B')
          expect(spy).not.toHaveBeenCalled()
          done()
        }, wait * 2)
      }, 0)
    })

    it('late-rendered view inside conditional blocks', function (done) {
      var component = {
        template:
          '<div>' +
            '<div v-if="show">' +
              '<router-view></router-view>' +
            '</div>' +
          '</div>',
        data: function () {
          return { show: false }
        },
        compiled: function () {
          var self = this
          setTimeout(function () {
            self.show = true
          }, wait)
        }
      }
      router = new Router({
        abstract: true
      })
      router.map({
        '/a': {
          component: component,
          subRoutes: {
            '/b': {
              component: {
                template: 'Rendered!'
              }
            }
          }
        }
      })
      router.start(Vue.extend(component), el)
      router.go('/a/b')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('Rendered!')
        done()
      }, wait * 3)
    })

    it('switching between rotues with conditional <router-view>', function (done) {
      router = new Router({
        abstract: true
      })
      router.map({
        '/foo': {
          component: {
            template:
              '<div>' +
                '{{ a }}' +
                '<router-view v-if="!$loadingRouteData"></router-view>' +
              '</div>',
            data: function () {
              return { a: 0 }
            },
            route: {
              data: function (transition) {
                setTimeout(function () {
                  transition.next({
                    a: 123
                  })
                }, wait)
              }
            }
          },
          subRoutes: {
            '/bar': {
              component: {
                template: 'rendered'
              }
            }
          }
        },
        '/baz': {
          component: { template: 'baz' }
        }
      })
      router.start({
        template: '<div><router-view></router-view></div>'
      }, el)
      router.go('/foo/bar')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('123rendered')
        router.go('/baz')
        nextTick(function () {
          expect(router.app.$el.textContent).toBe('baz')
          // go again
          router.go('/foo/bar')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('123rendered')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  }

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

  function click (target) {
    var e = document.createEvent('HTMLEvents')
    e.initEvent('click', true, true)
    e.button = 0
    target.dispatchEvent(e)
  }
})

describe('Stringify Path', function () {

  var router
  beforeEach(function () {
    router = new Router({ abstract: true })
  })

  it('plain string', function () {
    expect(router.stringifyPath('a')).toBe('a')
  })

  it('object path', function () {
    expect(router.stringifyPath({ path: '/hi' })).toBe('/hi')
    expect(router.stringifyPath({ path: '/hi', query: { a: 1 }})).toBe('/hi?a=1')
    expect(router.stringifyPath({ path: '/hi', query: { a: 1, b: 2 }})).toBe('/hi?a=1&b=2')
    expect(router.stringifyPath({ path: '/hi?c=3', query: { a: 1, b: 2 }})).toBe('/hi?c=3&a=1&b=2')
    expect(router.stringifyPath({ path: '/hi', query: { a: '/c' }})).toBe('/hi?a=%2Fc')
  })

  it('named route', function () {
    router.map({
      '/test/:id': {
        name: 'a',
        component: {}
      }
    })
    expect(router.stringifyPath({ name: 'a' })).toBe('/test/:id')
    expect(router.stringifyPath({ name: 'a', params: { id: 0 }})).toBe('/test/0')
    expect(router.stringifyPath({ name: 'a', params: { id: 'hi' }})).toBe('/test/hi')
    expect(router.stringifyPath({ name: 'a', params: { id: '你好' }})).toBe('/test/' + encodeURIComponent('你好'))
    expect(router.stringifyPath({ name: 'a', params: { id: 'hi' }, query: { b: '/c' }})).toBe('/test/hi?b=%2Fc')
  })

  it('named route not found should throw error', function () {
    expect(function () {
      router.stringifyPath({
        name: 'a'
      })
    }).toThrow()
  })

  it('encodeURI', function () {
    router.map({
      '/test/:id': {
        name: 'a',
        component: {}
      }
    })
    expect(router.stringifyPath('/hi/你好')).toBe(encodeURI('/hi/你好'))
    expect(router.stringifyPath({ path: '/hi/你好' })).toBe(encodeURI('/hi/你好'))
    expect(router.stringifyPath({ name: 'a', params: { id: '你好' }})).toBe(encodeURI('/test/你好'))
  })

})
