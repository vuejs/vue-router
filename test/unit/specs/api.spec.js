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
        { path: '/a', component: { name: 'A' }, name: 'routeA' }
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
      { path: '/b', component: { name: 'B' }, name: 'routeB' }
    ])
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('B')

    // make sure it preserves previous routes
    router.push('/a')
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')

    // adding same name route with overwriteNames parameter set to true
    router.addRoutes([
      { path: '/c', component: { name: 'C' }, name: 'routeA' }
    ], true)
    router.push({ name: 'routeA' })
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('C')
    expect(router.currentRoute.path).toBe('/c')
    expect(router.currentRoute.name).toBe('routeA')

    // overwriting a route name with a nested route name
    router.addRoutes([
      {
        path: '/d',
        name: 'routeD',
        component: { name: 'D' },
        children: [
          {
            path: 'e',
            component: { name: 'E' },
            name: 'routeB'
          }
        ]
      }
    ], true)
    router.push({ name: 'routeB' })
    components = router.getMatchedComponents()
    expect(components.length).toBe(2)
    expect(components[0].name).toBe('D')
    expect(components[1].name).toBe('E')
    expect(router.currentRoute.path).toBe('/d/e')
    expect(router.currentRoute.name).toBe('routeB')

    // make sure it preserves previous routes
    router.push('/a')
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('A')
    expect(router.currentRoute.path).toBe('/a')
    expect(router.currentRoute.name).toBe('routeA')
    router.push('/b')
    components = router.getMatchedComponents()
    expect(components.length).toBe(1)
    expect(components[0].name).toBe('B')
    expect(router.currentRoute.path).toBe('/b')
    expect(router.currentRoute.name).toBe('routeB')
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

  beforeEach(() => {
    calls = []
    spy1 = jasmine.createSpy('complete')
    spy2 = jasmine.createSpy('abort')

    router = new Router({
      routes: [
        { path: '/foo', component: Foo }
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
})
