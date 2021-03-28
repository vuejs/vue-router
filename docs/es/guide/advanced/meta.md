# Route Meta Fields

Sometimes, you might want to attach arbitrary information to routes like transition names, who can access the route, etc. This can be achieved through the `meta` property which accepts an object of properties and can be accessed on the route location and navigation guards. You can define `meta` properties like this:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

So how do we access this `meta` field?

First, each route object in the `routes` configuration is called a **route record**. Route records may be nested. Therefore when a route is matched, it can potentially match more than one route record.

For example, with the above route config, the URL `/foo/bar` will match both the parent route record and the child route record.

All route records matched by a route are exposed on the `$route` object (and also route objects in navigation guards) as the `$route.matched` Array. Therefore, we will need to iterate over `$route.matched` to check for meta fields in route records.

An example use case is checking for a meta field in the global navigation guard:

```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
```
