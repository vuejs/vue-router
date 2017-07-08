import Router from '../../../src/index'

describe('router.onReady', () => {
  it('should work', done => {
    const calls = []

    const router = new Router({
      mode: 'abstract',
      routes: [
        {
          path: '/a',
          component: {
            name: 'A',
            beforeRouteEnter: (to, from, next) => {
              setTimeout(() => {
                calls.push(2)
                next()
              }, 1)
            }
          }
        }
      ]
    })

    router.beforeEach((to, from, next) => {
      setTimeout(() => {
        calls.push(1)
        next()
      }, 1)
    })

    router.onReady(() => {
      expect(calls).toEqual([1, 2])
      // sync call when already ready
      router.onReady(() => {
        calls.push(3)
      })
      expect(calls).toEqual([1, 2, 3])
      done()
    })

    router.push('/a')
    expect(calls).toEqual([])
  })
})

describe('router.addRoutes', () => {
  it('should work', () => {
    const router = new Router({
      mode: 'abstract',
      routes: [
        { path: '/a', component: { name: 'A' }}
      ]
    })

    router.push('/a')
    let components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')

    router.push('/b')
    components = router.getMatchedComponents()
    expect(components.length).toBe(0)

    router.addRoutes([
      { path: '/b', component: { name: 'B' }}
    ])
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('B')

    // make sure it preserves previous routes
    router.push('/a')
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')
  })

  it('should load children to an existing parent route', function () {
    const router = new Router({
      mode: 'abstract',
      routes: [
        { path: '/a', component: { name: 'A' }}
      ]
    })

    router.push('/a')
    let components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')

    router.push('/a/b')
    components = router.getMatchedComponents()
    expect(components.length).toBe(0)

    // make sure it preserves previous routes
    router.push('/a')
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')
  })
})

describe('router.push/replace callbacks', () => {
  let calls = []
  let router, spy1, spy2

  const Foo = {
    beforeRouteEnter (to, from, next) {
      calls.push(3)
      setTimeout(() => {
        calls.push(4)
        next()
      }, 1)
    }
  }

  const Bar = {
    beforeRouteEnter (to, from, next) {
      calls.push(5)
      setTimeout(() => {
        calls.push(6)
        next()
      }, 1)
    }
  }

  const AsyncFoo = {
    beforeRouteEnter (to, from, next) {
      calls.push(13)
      setTimeout(() => {
        calls.push(14)
        next()
      }, 1)
    }
  }

  const AsyncBar = {
    beforeRouteEnter (to, from, next) {
      calls.push(15)
      setTimeout(() => {
        calls.push(16)
        next()
      }, 1)
    }
  }

  beforeEach(() => {
    calls = []
    spy1 = jasmine.createSpy('complete')
    spy2 = jasmine.createSpy('abort')

    router = new Router({
      routes: [
        { path: '/foo', component: Foo },
        {
          path: '/asyncFoo',
          component: AsyncFoo,
          loadChildren: function () {
            return Promise.resolve([
              {
                path: 'asyncBar',
                component: AsyncBar
              }
            ])
          }
        },
        {
          path: '/asyncBiz',
          component: AsyncFoo,
          loadChildren: function () {
            return Promise.resolve([
              {
                path: '',
                component: AsyncBar
              }
            ])
          }
        }
      ]
    })

    router.beforeEach((to, from, next) => {
      calls.push(1)
      setTimeout(() => {
        calls.push(2)
        next()
      }, 1)
    })
  })

  it('push complete', done => {
    router.push('/foo', () => {
      expect(calls).toEqual([1, 2, 3, 4])
      done()
    })
  })

  it('push abort', done => {
    router.push('/foo', spy1, spy2)
    router.push('/bar', () => {
      expect(calls).toEqual([1, 1, 2, 2])
      expect(spy1).not.toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      done()
    })
  })

  it('replace complete', done => {
    router.replace('/foo', () => {
      expect(calls).toEqual([1, 2, 3, 4])
      done()
    })
  })

  it('replace abort', done => {
    router.replace('/foo', spy1, spy2)
    router.replace('/bar', () => {
      expect(calls).toEqual([1, 1, 2, 2])
      expect(spy1).not.toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
      done()
    })
  })

  describe('async children', function () {
    it('push complete', done => {
      router.push('/asyncFoo/asyncBar', () => {
        expect(calls).toEqual([1, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        done()
      })
    })

    it('push abort', done => {
      router.push('/foo', spy1, spy2)
      router.push('/asyncFoo/asyncBar', () => {
        expect(calls).toEqual([1, 1, 2, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        done()
      })
    })

    it('replace complete', done => {
      router.replace('/asyncFoo/asyncBar', () => {
        expect(calls).toEqual([1, 2, 13, 14, 1, 2, 13, 14, 15, 16])

        let components = router.getMatchedComponents()
        expect(components.length).toBe(2)
        done()
      })
    })

    it('replace abort', done => {
      router.replace('/foo', spy1, spy2)
      router.replace('/asyncFoo/asyncBar', () => {
        expect(calls).toEqual([1, 1, 2, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()

        let components = router.getMatchedComponents()
        expect(components.length).toBe(2)
        
        done()
      })
    })

    it('push default complete', done => {
      router.push('/asyncBiz', () => {
        expect(calls).toEqual([1, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        done()
      })
    })

    it('push default abort', done => {
      router.push('/foo', spy1, spy2)
      router.push('/asyncBiz', () => {
        expect(calls).toEqual([1, 1, 2, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        done()
      })
    })

    it('replace default complete', done => {
      router.replace('/asyncBiz', () => {
        expect(calls).toEqual([1, 2, 13, 14, 1, 2, 13, 14, 15, 16])

        let components = router.getMatchedComponents()
        expect(components.length).toBe(2)
        done()
      })
    })

    it('replace default abort', done => {
      router.replace('/foo', spy1, spy2)
      router.replace('/asyncBiz', () => {
        expect(calls).toEqual([1, 1, 2, 2, 13, 14, 1, 2, 13, 14, 15, 16])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()

        let components = router.getMatchedComponents()
        expect(components.length).toBe(2)
        
        done()
      })
    })
  })
})
