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

describe('router app destroy handling', () => {
  Vue.use(Router)

  const router = new Router({
    mode: 'abstract',
    routes: [
      { path: '/', component: { name: 'A' }}
    ]
  })

  // Add main app
  const app1 = new Vue({
    router,
    render (h) { return h('div') }
  })

  // Add 2nd app
  const app2 = new Vue({
    router,
    render (h) { return h('div') }
  })

  // Add 3rd app
  const app3 = new Vue({
    router,
    render (h) { return h('div') }
  })

  it('router and apps should be defined', () => {
    expect(router).toBeDefined()
    expect(router istanceof Router).toBe(true)
    expect(app1).toBeDefined()
    expect(app1 instanceof Vue).toBe(true)
    expect(app2).toBeDefined()
    expect(app2 instanceof Vue).toBe(true)
    expect(app3).toBeDefined()
    expect(app3 instanceof Vue).toBe(true)
    expect(app1.$router.apps).toBe(app2.$router.apps)
    expect(app2.$router.apps).toBe(app3.$router.apps)
    expect(app1.$router.app).toBe(app2.$router.app)
    expect(app2.$router.app).toBe(app3.$router.app)
  })

  it('should have 3 registered apps', () => {
    expect(app1.$router).toBeDefined()
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
    expect(app1.$router.app[0]).toBe(app1)
    expect(app1.$router.app[1]).toBe(app3)
  })

  it('should remove 1st destroyed app from this.apps and replace this.app', () => {
    app1.$destroy()
    expect(app3.$router.app).toBe(app3)
    expect(app3.$router.apps.length).toBe(1)
    expect(app3.$router.app[0]).toBe(app3)
  })

  it('should remove last destroyed app from this.apps', () => {
    app3.$destroy()
    expect(app3.$router.app).toBe(app3)
    expect(app3.$router.apps.length).toBe(0)
  })

  it('should replace app with new app', () => {
    const app4 = new Vue({
      router,
      render (h) { return h('div') }
    })
    expect(app4.$router.app).toBe(app4)
    expect(app4.$router.apps.length).toBe(1)
    expect(app4.$router.app[0]).toBe(app4)
  })
})
