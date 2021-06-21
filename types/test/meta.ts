import VueRouter from '../index'

const component = { template: '<div>home</div>' }

declare module '../index' {
  export interface RouteMeta {
    requiresAuth?: boolean
    nested: { foo: string }
  }
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component,
      meta: {
        requiresAuth: true,
        // still allowed
        other: true,
        nested: {
          foo: 'bar'
        }
      }
    },
    {
      path: '/foo',
      component,
      // @ts-expect-error
      meta: {}
    }
  ]
})

router.beforeEach(to => {
  // should pass
  if (to.meta!.requiresAuth === true) {
  }
  // still pass because any
  if (to.meta!.lol === true) {
  }
  // @ts-expect-error: nested will never be true
  if (to.meta!.nested === true) {
  }
})
