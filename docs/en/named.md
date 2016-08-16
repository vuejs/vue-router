# Named Routes

Sometimes it is more convenient to identify a route with a name, especially when performing navigations. You can give a route a name in the route config like this:

``` js
router.map({
  '/user/:userId': {
    name: 'user', // give the route a name
    component: { ... }
  }
})
```

To link to a named route, you can use `v-link` like this:

``` html
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

You can also navigate to a named route programatically using `router.go()`:

``` js
router.go({ name: 'user', params: { userId: 123 }})
```

In both cases, the router will navigate to the path `/user/123`.
