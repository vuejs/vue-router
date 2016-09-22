# Scroll Behavior

When using client-side routing, we may want to scroll to top when navigating to a new route, or preserve the scrolling position of history entries just like real page reload does. `vue-router` allows you to achieve these and even better, allows you to completely customize the scroll behavior on route navigation.

**Note: this feature only works in HTML5 history mode.**

When creating the router instance, you can provide the `scrollBehavior` function:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return desired position
  }
})
```

The `scrollBehavior` function receives the `to` and `from` route objects. The third argument, `savedPosition`, is only available if this is a `popstate` navigation (triggered by the browser's back/forward buttons).

The function can return a scroll position object. The object could be in the form of:

- `{ x: number, y: number }`
- `{ selector: string }`

If a falsy value or an empty object is returned, no scrolling will happen.

For example:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

This will simply make the page scroll to top for all route navigations.

Returning the `savedPosition` will result in a native-like behavior when navigating with back/forward buttons:

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

If you want to simulate the "scroll to anchor" behavior:

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

We can also use [route meta fields](meta.md) to implement fine-grained scroll behavior control. Check out a full example [here](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).
