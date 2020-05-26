# Navigation Guards

As the name suggests, the navigation guards provided by `vue-router` are primarily used to guard navigations either by redirecting it or canceling it. There are a number of ways to hook into the route navigation process: globally, per-route, or in-component.

Remember that **params or query changes won't trigger enter/leave navigation guards**. You can either [watch the `$route` object](../essentials/dynamic-matching.md#reacting-to-params-changes) to react to those changes, or use the `beforeRouteUpdate` in-component guard.

## Global Before Guards

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-configure-an-authentication-middleware-route-guard-with-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to create an authentication middleware with a global route guard on Vue School">Learn how navigation guards works with a free lesson on Vue School</a></div>

You can register global before guards using `router.beforeEach`:

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered **pending** before all hooks have been resolved.

Every guard function receives three arguments:

- **`to: Route`**: the target [Route Object](../../api/#the-route-object) being navigated to.

- **`from: Route`**: the current route being navigated away from.

- **`next: Function`**: this function must be called to **resolve** the hook. The action depends on the arguments provided to `next`:

  - **`next()`**: move on to the next hook in the pipeline. If no hooks are left, the navigation is **confirmed**.

  - **`next(false)`**: abort the current navigation. If the browser URL was changed (either manually by the user or via back button), it will be reset to that of the `from` route.

  - **`next('/')` or `next({ path: '/' })`**: redirect to a different location. The current navigation will be aborted and a new one will be started. You can pass any location object to `next`, which allows you to specify options like `replace: true`, `name: 'home'` and any option used in [`router-link`'s `to` prop](../../api/#to) or [`router.push`](../../api/#router-push)

  - **`next(error)`**: (2.4.0+) if the argument passed to `next` is an instance of `Error`, the navigation will be aborted and the error will be passed to callbacks registered via [`router.onError()`](../../api/#router-onerror).

**Make sure that the `next` function is called exactly once in any given pass through the navigation guard. It can appear more than once, but only if the logical paths have no overlap, otherwise the hook will never be resolved or produce errors.** Here is an example of redirecting to user to `/login` if they are not authenticated:

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // if the user is not authenticated, `next` is called twice
  next()
})
```

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Global Resolve Guards

You can register a global guard with `router.beforeResolve`. This is similar to `router.beforeEach`, with the difference that resolve guards will be called right before the navigation is confirmed, **after all in-component guards and async route components are resolved**.

## Global After Hooks

You can also register global after hooks, however unlike guards, these hooks do not get a `next` function and cannot affect the navigation:

```js
router.afterEach((to, from) => {
  // ...
})
```

## Per-Route Guard

You can define `beforeEnter` guards directly on a route's configuration object:

```js
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

## In-Component Guards

Finally, you can directly define route navigation guards inside route components (the ones passed to the router configuration) with the following options:

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
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

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component instance via `vm`
  })
}
```

Note that `beforeRouteEnter` is the only guard that supports passing a callback to `next`. For `beforeRouteUpdate` and `beforeRouteLeave`, `this` is already available, so passing a callback is unnecessary and therefore *not supported*:

```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

The **leave guard** is usually used to prevent the user from accidentally leaving the route with unsaved edits. The navigation can be canceled by calling `next(false)`.

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## The Full Navigation Resolution Flow

1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.
3. Call global `beforeEach` guards.
4. Call `beforeRouteUpdate` guards in reused components.
5. Call `beforeEnter` in route configs.
6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components.
8. Call global `beforeResolve` guards.
9. Navigation confirmed.
10. Call global `afterEach` hooks.
11. DOM updates triggered.
12. Call callbacks passed to `next` in `beforeRouteEnter` guards with instantiated instances.
