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

You can check out a live example [here](https://jsfiddle.net/yyx990803/4xfa2f19/).

You can have multiple dynamic segments in the same route, and they will map to corresponding fields on `$route.params`. Examples:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

In addition to `$route.params`, the `$route` object also exposes other useful information such as `$route.query` (if there is a query in the URL), `$route.hash`, etc. You can check out the full details in the [API Reference](../../api/#the-route-object).

## Reacting to Params Changes

One thing to note when using routes with params is that when the user navigates from `/user/foo` to `/user/bar`, **the same component instance will be reused**. Since both routes render the same component, this is more efficient than destroying the old instance and then creating a new one. **However, this also means that the lifecycle hooks of the component will not be called**.

To react to params changes in the same component, you can simply watch the `$route` object:

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // react to route changes...
    }
  }
}
```

Or, use the `beforeRouteUpdate` [navigation guard](../advanced/navigation-guards.html) introduced in 2.2:

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```

## Catch all / 404 Not found Route

Regular params will only match characters in between url fragments, separated by `/`. If we want to match **anything**, we can use the asterisk (`*`):

```js
{
  // will match everything
  path: '*'
}
{
  // will match anything starting with `/user-`
  path: '/user-*'
}
```

When using _asterisk_ routes, make sure to correctly order your routes so that _asterisk_ ones are at the end.
The route `{ path: '*' }` is usually used to 404 client side. If you are using _History mode_, make sure to [correctly configure your server](./history-mode.md) as well.

When using an _asterisk_, a param named `pathMatch` is automatically added to `$route.params`. It contains the rest of the url matched by the _asterisk_:

```js
// Given a route { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'

// Given a route { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

## Advanced Matching Patterns

`vue-router` uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) as its path matching engine, so it supports many advanced matching patterns such as optional dynamic segments, zero or more / one or more requirements, and even custom regex patterns. Check out its [documentation](https://github.com/pillarjs/path-to-regexp#parameters) for these advanced patterns, and [this example](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) of using them in `vue-router`.

## Matching Priority

Sometimes the same URL may be matched by multiple routes. In such a case the matching priority is determined by the order of route definition: the earlier a route is defined, the higher priority it gets.
