# Named Routes

Sometimes it is more convenient to identify a route with a name, especially when
performing navigations. You can give a route a name in the `routes` options
while creating the Router instance:

``` js
const router = new VueRouter({
  routes: [
    // Foo is rendered when /foo is matched
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

To link to a named route, you can pass an object to the `router-link`
component's `to` prop:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

This is the exact same object used programatically with `router.push()`:

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

In both cases, the router will navigate to the path `/user/123`.
