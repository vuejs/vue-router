# Dynamic Route Matching

Very often we will need to map routes with the given pattern to the same component. For example we may have a `User` component which should be rendered for all users but with different user IDs. In `vue-router` we can use a dynamic segment in the path to achieve that:

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: '/user/:id', component: User }
  ]
})
```

Now URLs like `/user/foo` and `/user/bar` will both map to the same route.

A dynamic segment is denoted by a colon `:`. When a route is matched, the value of the dynamic segments will be exposed as `this.$route.params` in every component. Therefore, we can render the current user ID by updating `User`'s template to this:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

You can checkout a live example [here](http://jsfiddle.net/yyx990803/4xfa2f19/).

You can have multiple dynamic segments in the same route, and they will map to corresponding fields on `$route.params`. Examples:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

In addition to `$route.params`, the `$route` object also exposes other useful information such as `$route.query` (if there is a query in the URL), `$route.hash`, etc. You can check out the full details in the [API Reference](../api/route-object.md).

### Advanced Matching Patterns

`vue-router` uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) as its path matching engine, so it supports many advanced matching patterns such as optional dynamic segments, zero or more / one or more requirements, and even custom regex patterns. Check out its [documentation](https://github.com/pillarjs/path-to-regexp#parameters) for these advanced patterns, and [this example](https://github.com/vuejs/vue-router/blob/next/examples/route-matching/app.js) of using them in `vue-router`.

### Matching Priority

Sometimes the same URL may be matched by multiple routes. In such a case the matching priority is determined by the order of route definition: the earlier a route is defined, the higher priority it gets.
