# Redirect and Alias

### Redirect

Redirecting is also done in the `routes` configuration. To redirect from `/a` to `/b`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

The redirect can also be targeting a named route:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Or even use a function for dynamic redirecting:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // the function receives the target route as the argument
      // return redirect path/location here.
    }}
  ]
})
```

For other advanced usage, checkout the [example](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

A redirect means when the user visits `/a`, and URL will be replaced by `/b`, and then matched as `/b`. But what is an alias?

**An alias of `/a` as `/b` means when the user visits `/b`, the URL remains `/b`, but it will be matched as if the user is visiting `/a`.**

The above can be expressed in the route configuration as:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

An alias gives you the freedom to map a UI structure to an arbitrary URL, instead of being constrained by the configuration's nesting structure.

For advanced usage, checkout the [example](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
