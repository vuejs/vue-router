# `router.on(path, config)`

Add a single root-level route configuration. Internally, `router.map()` simply calls `router.on()` for each key-value pair in the router map object it receives.

### Arguments

- `path: String` - see [Route Matching](../route.md#route-matching)
- `config: Object` - see [Route Config Object](map.md#route-config-object).

### Returns

- The router instance itself.

### Example

``` js
router.on('/user/:userId', {
  component: {
    template: '<div>{{$route.params.userId}}</div>'
  }
})
```
