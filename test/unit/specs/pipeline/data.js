var testUtils = require('../../lib/pipeline-test-util')
var test = testUtils.test
var assertCalls = testUtils.assertCalls
var routerUtil = require('../../../../src/util')

describe('data', function () {

  beforeEach(function () {
    spyOn(routerUtil, 'warn')
  })

  it('initial load', function (done) {
    test({
      data: {
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        done()
      }, wait * 2)
    })
  })

  it('reload', function (done) {
    test({
      data: {
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        router.go('/data/reload')
        assertCalls(calls, ['data.data', 'data.data'])
        router.app.$nextTick(function () {
          expect(router.app.$el.textContent).toBe('loading...')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('reload')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  })

  it('waitForData', function (done) {
    test({
      data: {
        waitForData: true,
        data: function (transition) {
          setTimeout(function () {
            transition.next({
              msg: transition.to.params.msg
            })
          }, wait)
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        router.go('/data/reload')
        assertCalls(calls, ['data.data', 'data.data'])
        router.app.$nextTick(function () {
          expect(router.app.$el.textContent).toBe('loading...')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('reload')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  })

  it('waitForData + promise sugar', function (done) {
    test({
      data: {
        waitForData: true,
        data: function (transition) {
          return {
            msg: new Promise(function (resolve) {
              setTimeout(function () {
                resolve(transition.to.params.msg)
              }, wait)
            })
          }
        }
      }
    }, function (router, calls) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        router.go('/data/reload')
        assertCalls(calls, ['data.data', 'data.data'])
        router.app.$nextTick(function () {
          expect(router.app.$el.textContent).toBe('loading...')
          setTimeout(function () {
            expect(router.app.$el.textContent).toBe('reload')
            done()
          }, wait * 2)
        })
      }, wait * 2)
    })
  })

  it('promise reject', function (done) {
    test({
      data: {
        data: function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject()
            }, wait)
          })
        }
      }
    }, function (router, calls, emitter) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        // should not abort
        expect(router.app.$el.textContent).toBe('default')
        done()
      }, wait * 2)
    })
  })

  it('return object containing promises', function (done) {
    test({
      data: {
        data: function (transition) {
          return {
            msg: new Promise(function (resolve) {
              setTimeout(function () {
                resolve(transition.to.params.msg)
              }, wait)
            })
          }
        }
      }
    }, function (router, calls, emitter) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello')
        done()
      }, wait * 2)
    })
  })

  it('return object containing promises reject', function (done) {
    test({
      data: {
        data: function (transition) {
          return {
            msg: new Promise(function (resolve, reject) {
              setTimeout(function () {
                reject()
              }, wait)
            })
          }
        }
      }
    }, function (router, calls, emitter) {
      router.go('/data/hello')
      assertCalls(calls, ['data.data'])
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        // should not abort
        expect(router.app.$el.textContent).toBe('default')
        done()
      }, wait * 2)
    })
  })

  it('multiple data hooks', function (done) {
    test({
      data: {
        data: [
          function (transition) {
            return {
              msg: new Promise(function (resolve) {
                setTimeout(function () {
                  resolve(transition.to.params.msg)
                }, wait)
              })
            }
          },
          function (transition) {
            return new Promise(function (resolve) {
              setTimeout(function () {
                resolve({
                  otherMsg: ' ' + transition.to.params.msg + '2'
                })
              }, wait)
            })
          }
        ],
        mixins: [
          {
            route: {
              data: function (transition) {
                transition.next({
                  thirdMsg: ' ' + transition.to.params.msg + '3'
                })
              }
            }
          }
        ]
      }
    }, function (router, calls, emitter) {
      router.go('/data/hello')
      expect(router.app.$el.textContent).toBe('loading...')
      setTimeout(function () {
        expect(router.app.$el.textContent).toBe('hello hello2 hello3')
        done()
      }, wait * 4)
    })
  })
})
