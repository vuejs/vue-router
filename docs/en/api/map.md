# `router.map(routeMap)`

The main method to define route mappings for the router.

### Arguments

- `routeMap: Object`

  An object whose keys are paths and values are route config objects. For path matching rules, see [Route Matching](../route.html#route-matching).

### Returns

- The router instance itself.

### Route Config Object

A route config object can contain two fields:

- `component`: The Vue component to render into the top-level `<router-view>` outlet when this path is matched. The value could either be a constructor returned by calling `Vue.extend`, or a plain component options object. In the latter case the router will implicitly call `Vue.extend` for you.

- `subRoutes`: You can nest another sub route-map here. For each sub path in the `routeRoutes` map, the router will match it against the full path by appending it to the parent path. The matched component will be rendered into the parent route component's `<router-view>` outlet.

### Example

``` js
router.map({
  // component constructor
  '/a': {
    component: Vue.extend({ /* ... */ })
  },
  // plain component options object
  '/b': {
    component: {
      template: '<p>Hello from /b</p>'
    }
  },
  // nested routes
  '/c': {
    component: {
      // simply render the child view
      template: '<router-view></router-view>'
    },
    subRoutes: {
      // rendered when the path is /c/d
      '/d': { component: { template: 'D' }},
      // rendered when the path is /c/e
      '/e': { component: { template: 'E' }}
    }
  }
})
```
