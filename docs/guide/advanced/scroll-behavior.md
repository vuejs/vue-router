# Scroll Behavior

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-control-the-scroll-behavior-of-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to control the scroll behavior on Vue School">Learn to control the scroll behavior with a free lesson on Vue School</a></div>

When using client-side routing, we may want to scroll to top when navigating to a new route, or preserve the scrolling position of history entries just like real page reload does. `vue-router` allows you to achieve these and even better, allows you to completely customize the scroll behavior on route navigation.

**Note: this feature only works if the browser supports `history.pushState`.**

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
- `{ selector: string, offset? : { x: number, y: number }}` (offset only supported in 2.6.0+)

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
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

We can also use [route meta fields](meta.md) to implement fine-grained scroll behavior control. Check out a full example [here](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).

## Async Scrolling

> New in 2.8.0

You can also return a Promise that resolves to the desired position descriptor:

``` js
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

It's possible to hook this up with events from a page-level transition component to make the scroll behavior play nicely with your page transitions, but due to the possible variance and complexity in use cases, we simply provide this primitive to enable specific userland implementations.

## Smooth Scrolling

You can enable native smooth scrolling for [browsers supporting it](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior) by simply adding the `behavior` option to the object returned inside `scrollBehavior`:

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash,
      behavior: 'smooth',
    }
  }
}
```
