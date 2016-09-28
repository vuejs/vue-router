# Navigation Guards

As the name suggests, the navigation guards provided by `vue-router` are primarily used to guard navigations either by redirecting it or canceling it. There are a number of ways to hook into the route navigation process: globally, per-route, or in-component.

### Global Guards

You can register global before guards using `router.beforeEach`:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered **pending** before all hooks have been resolved.

Every guard function receives three arguments:

- **`to: Route`**: the target [Route Object](../api/route-object.md) being navigated to.

- **`from: Route`**: the current route being navigated away from.

- **`next: Function`**: this function must be called to **resolve** the hook. The action depends on the arguments provided to `next`:

  - **`next()`**: move on to the next hook in the pipeline. If no hooks are left, the navigation is **confirmed**.

  - **`next(false)`**: abort the current navigation. If the browser URL was changed (either manually by the user or via back button), it will be reset to that of the `from` route.

  - **`next('/')` or `next({ path: '/' })`**: redirect to a different location. The current navigation will be aborted and a new one will be started.

**Make sure to always call the `next` function, otherwise the hook will never be resolved.**

You can also register global after hooks, however unlike guards, these hooks do not get a `next` function and cannot affect the navigation:

``` js
router.afterEach((to, from) => {
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
      beforeEnter: (to, from, next) => {
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
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  }
}
```

The `beforeRouteEnter` guard does **NOT** have access to `this`, because the guard is called before the navigation is confirmed, thus the new entering component has not even been created yet.

However, you can access the instance by passing a callback to `next`. The callback will be called when the navigation is confirmed, and the component instance will be passed to the callback as the argument:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component instance via `vm`
  })
}
```

You can directly access `this` inside `beforeRouteLeave`. The leave guard is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by calling `next(false)`.
