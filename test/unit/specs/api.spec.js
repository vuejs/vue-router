import Router from '../../../src/index'
import Vue from 'vue'

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

describe('route matching', () => {
  it('resolves parent params when using current route', () => {
    const router = new Router({
      mode: 'abstract',
      routes: [
        {
          path: '/a/:id',
          component: { name: 'A' },
          children: [{ name: 'b', path: 'b', component: { name: 'B' }}]
        }
      ]
    })

    router.push('/a/1')

    const { route, resolved } = router.resolve({ name: 'b' })
    expect(route.params).toEqual({ id: '1' })
    expect(resolved.params).toEqual({ id: '1' })
  })

  it('can override currentRoute', () => {
    const router = new Router({
      mode: 'abstract',
      routes: [
        {
          path: '/a/:id',
          component: { name: 'A' },
          children: [{ name: 'b', path: 'b', component: { name: 'B' }}]
        }
      ]
    })

    router.push('/a/1')

    const { route, resolved } = router.resolve({ name: 'b' }, { params: { id: '2' }, path: '/a/2' })
    expect(route.params).toEqual({ id: '2' })
    expect(resolved.params).toEqual({ id: '2' })
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
})

describe('router.push/replace', () => {
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
  describe('callbacks', () => {
    it('push does not return a Promise when a callback is passed', done => {
      expect(router.push('/foo', done)).toEqual(undefined)
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

    it('replace does not return a Promise when a callback is passed', done => {
      expect(router.replace('/foo', done)).toEqual(undefined)
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

  describe('promises', () => {
    it('push complete', done => {
      router.push('/foo')
        .then(spy1)
        .finally(() => {
          expect(calls).toEqual([1, 2, 3, 4])
          expect(spy1).toHaveBeenCalledWith(router.currentRoute)
          done()
        })
    })

    it('push abort', done => {
      router.push('/foo').catch(spy2)
      router.push('/bar').finally(() => {
        expect(calls).toEqual([1, 1, 2, 2])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        done()
      })
    })

    it('replace complete', done => {
      router.replace('/foo')
        .then(spy1)
        .finally(() => {
          expect(calls).toEqual([1, 2, 3, 4])
          expect(spy1).toHaveBeenCalledWith(router.currentRoute)
          done()
        })
    })

    it('replace abort', done => {
      router.replace('/foo').catch(spy2)
      router.replace('/bar').finally(() => {
        expect(calls).toEqual([1, 1, 2, 2])
        expect(spy1).not.toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        done()
      })
    })
  })
})

describe('router app destroy handling', () => {
  Vue.use(Router)

  let router, app1, app2, app3

  beforeEach(() => {
    router = new Router({
      mode: 'abstract',
      routes: [
        { path: '/', component: { name: 'A' }}
      ]
    })

    // Add main app
    app1 = new Vue({
      router,
      render (h) { return h('div') }
    })

    // Add 2nd app
    app2 = new Vue({
      router,
      render (h) { return h('div') }
    })

    // Add 3rd app
    app3 = new Vue({
      router,
      render (h) { return h('div') }
    })
  })

  it('all apps point to the same router instance', () => {
    expect(app1.$router).toBe(app2.$router)
    expect(app2.$router).toBe(app3.$router)
  })

  it('should have all 3 registered apps', () => {
    expect(app1.$router.app).toBe(app1)
    expect(app1.$router.apps.length).toBe(3)
    expect(app1.$router.apps[0]).toBe(app1)
    expect(app1.$router.apps[1]).toBe(app2)
    expect(app1.$router.apps[2]).toBe(app3)
  })

  it('should remove 2nd destroyed app from this.apps', () => {
    app2.$destroy()
    expect(app1.$router.app).toBe(app1)
    expect(app1.$router.apps.length).toBe(2)
    expect(app1.$router.apps[0]).toBe(app1)
    expect(app1.$router.apps[1]).toBe(app3)
  })

  it('should remove 1st destroyed app and replace current app', () => {
    app1.$destroy()
    expect(app3.$router.app).toBe(app2)
    expect(app3.$router.apps.length).toBe(2)
    expect(app3.$router.apps[0]).toBe(app2)
    expect(app1.$router.apps[1]).toBe(app3)
  })

  it('should remove all apps', () => {
    app1.$destroy()
    app3.$destroy()
    app2.$destroy()
    expect(app3.$router.app).toBe(null)
    expect(app3.$router.apps.length).toBe(0)
  })

  it('should keep current app if already defined', () => {
    const app4 = new Vue({
      router,
      render (h) { return h('div') }
    })
    expect(app4.$router.app).toBe(app1)
    expect(app4.$router.apps.length).toBe(4)
    expect(app4.$router.apps[3]).toBe(app4)
  })

  it('should replace current app if none is assigned when creating the app', () => {
    app1.$destroy()
    app3.$destroy()
    app2.$destroy()
    const app4 = new Vue({
      router,
      render (h) { return h('div') }
    })
    expect(router.app).toBe(app4)
    expect(app4.$router).toBe(router)
    expect(app4.$router.apps.length).toBe(1)
    expect(app4.$router.apps[0]).toBe(app4)
  })
})
