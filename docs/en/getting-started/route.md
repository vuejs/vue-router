# Route Object & Route Matching

Vue-router supports matching paths that contain dynamic segments, star segments and query strings. All these information of a parsed route will be accessible on the exposed **Route Context Objects** (we will just call them "route" objects from now on). The route object will be injected into every component in a vue-router-enabled app as `this.$route`, and will be updated whenever a route transition is performed.

A route object exposes the following properties:

- **$route.path**

  A string that equals the path of the current route, always resolved as an absolute path. e.g. `"/foo/bar"`.

- **$route.params**

  An object that contains key/value pairs of dynamic segments and star segments. More details below.

- **$route.query**

  An object that contains key/value pairs of the query string. For example, for a path `/foo?user=1`, we get `$route.query.user == 1`.

- **$route.matched**

  An array containing the route configuration objects for all matched segments in the current route.

- **$route.name**

  The name of the current (deepest) matched route, if it has one. (See [named routes](./named-routes.md))
  
- **$route.meta**

  The meta of the current (deepest) matched route, if defined. More details below.

### Meta Field

In addition to the built-in properties, custom fields can be defined under `meta` field in the config, and will be exposed on the route object. For example:

``` js
var router = new VueRouter({
  routes: [{
    path: '/a'
    component: { ... },
    meta: {
      auth: true
    }
  }]
})
```

When `/a` is matched, `$route.meta.auth` will be `true`. This allows us to perform authentication checks in global hooks:

``` js
router.beforeEach(function(route, redirect, next) {
  if (route.matched.some(m => m.meta.auth) && !authenticated) {
    redirect('/login')
  } else {
    next()
  }
})
```

> See [API](api/before-each.md) for how the `beforeEach` hook works.

Note that in the example above, we checked `route.matched` instead of just `route.meta.auth`. This is because when a nested route is matched, only the deepest matched sub route's meta will be exposed on `route`. To get the `meta`s of all the matched routes, we need to iterate through `route.matched`.

### Using in Templates

You can directly bind to the `$route` object inside your component templates. For example:

``` html
<div>
  <p>Current route path: {{$route.path}}</p>
  <!-- `stringify` is a method provided by you -->
  <p>Current route params: {{stringify($route.params)}}</p>
</div>
```

### Route Matching

#### Dynamic Segments

Dynamic segments can be defined in the form of path segments with a leading colon, e.g. in `user/:username`, `:username` is the dynamic segment. It will match paths like `/user/foo` or `/user/bar`. When a path containing a dynamic segment is matched, the dynamic segments will be available inside `$route.params`.

Example Usage:

``` js
var router = new VueRouter({
  routes: [{
    path: '/user/:username',
    component: {
      template: '<p>username is {{$route.params.username}}</p>'
    }
  }]
})
```

A path can contain multiple dynamic segments, and each of them will be stored as a key/value pair in `$route.params`.

Examples:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

#### Star Segments

While dynamic segments can correspond to only a single segment in a path, star segments is basically the "greedy" version of it. For example `/foo/*bar` will match anything that starts with `/foo/`. The part matched by the star segment will also be available in `$route.params`.

Examples:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/*any | /user/a/b/c | `{ any: 'a/b/c' }` |
| /foo/*any/bar | /foo/a/b/bar | `{ any: 'a/b' }` |

#### Matching Precedence
The routes defined inside the array follows a simple rule of precedence: the latter overrides the former.

Example:
``` js
var router = new VueRouter({
  routes: [{
    path: '/user/:username',
    component: {
      template: '<p>username is {{$route.params.username}}</p>'
    }
  }, {
    path: '/user/foo',
    component: {
      template: '<p>This page is only for user Foo!</p>'
    }
  }]
})

// Now '/user/foo' shows 'This page is only for user Foo!' 
// instead of 'username is foo'
```
