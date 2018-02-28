# The Route Object

A **route object** represents the state of the current active route. It contains parsed information of the current URL and the **route records** matched by the URL.

The route object is immutable. Every successful navigation will result in a fresh route object.

The route object can be found in multiple places:

- Inside components as `this.$route`

- Inside `$route` watcher callbacks

- As the return value of calling `router.match(location)`

- Inside navigation guards as the first two arguments:

  ``` js
  router.beforeEach((to, from, next) => {
    // `to` and `from` are both route objects
  })
  ```

- Inside the `scrollBehavior` function as the first two arguments:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // `to` and `from` are both route objects
    }
  })
  ```

### Route Object Properties

- **$route.path**

  - type: `string`

    A string that equals the path of the current route, always resolved as an absolute path. e.g. `"/foo/bar"`.

- **$route.params**

  - type: `Object`

    An object that contains key/value pairs of dynamic segments and star segments. If there are no params the value will be an empty object.

- **$route.query**

  - type: `Object`

    An object that contains key/value pairs of the query string. For example, for a path `/foo?user=1`, we get `$route.query.user == 1`. If there is no query the value will be an empty object.

- **$route.hash**

  - type: `string`

    The hash of the current route (with the `#`), if it has one. If no hash is present the value will be an empty string.

- **$route.fullPath**

  - type: `string`

    The full resolved URL including query and hash.

- **$route.matched**

  - type: `Array<RouteRecord>`

  An Array containing **route records** for all nested path segments of the current route. Route records are the copies of the objects in the `routes` configuration Array (and in `children` Arrays):

  ``` js
  const router = new VueRouter({
    routes: [
      // the following object is a route record
      { path: '/foo', component: Foo,
        children: [
          // this is also a route record
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  When the URL is `/foo/bar`, `$route.matched` will be an Array containing both objects (cloned), in parent to child order.

- **$route.name**

  The name of the current route, if it has one. (See [Named Routes](../essentials/named-routes.md))

- **$route.redirectedFrom**

  The name of the route being redirected from, if there were one. (See [Redirect and Alias](../essentials/redirect-and-alias.md))
