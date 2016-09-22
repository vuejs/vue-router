# Navigation Guards

As the name suggests, the navigation guards provided by `vue-router` are primarily used to guard navigations either by redirecting it or canceling it. There are a number of ways to hook into the route navigation process: globally, per-route, or in-component.

### Global Guards

You can register global before guards using `router.beforeEach`:

``` js
const router = new VueRouter({ ... })

router.beforeEach((route, redirect, next) => {
  // ...
})
```

Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered **pending** before all hooks have been resolved.

Every guard function receives three arguments:

- `route: Route`: the target [Route Object](../api/route-object.md) being navigated to.

- `redirect: Function`: calling this function will abort the current navigation and start a new navigation towards the redirect target.

- `next: Function`: resolve this guard and proceed to the next guard in the pipeline. If there are no hooks left, then the navigation is **confirmed**.

**If neither `redirect` nor `next` is called, the navigation will be cancelled.**

You can also register global after hooks, however unlike guards, these hooks are much simpler and cannot affect the navigation:

``` js
router.afterEach(route => {
  // ...
})
```

### Per-Route Guard

You can define `beforeEnter` guards directly on a route's configuration object:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (route, redirect, next) => {
        // ...
      }
    }
  ]
})
```

These guards have the exact same signature as global before guards.

### In-Component Guards

Finally, you can directly define route navigation guards inside route components with `beforeRouteEnter` and `beforeRouteLeave`:

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (route, redirect, next) => {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteLeave (route, redirect, next) => {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  }
}
```

The `beforeRouteEnter` guard does **NOT** have access to `this`, because the guard is called before the navigation is confirmed, thus the new entering component has not even been created yet.

However, you can access the instance by passing a callback to `next`. The callback will be called when the navigation is confirmed, and the component instance will be passed to the callback as the argument:

``` js
beforeRouteEnter (route, redirect, next) => {
  next(vm => {
    // access to component instance via `vm`
  })
}
```

You can directly access `this` inside `beforeRouteLeave`. The leave guard is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by simply not calling `next` or `redirect`.
