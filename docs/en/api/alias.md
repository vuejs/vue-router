# `router.alias(aliasMap)`

Configures global alias rules for the router. The difference between alias and redirect is that instead of replacing the `fromPath` with `toPath`, an alias will preserve `fromPath` while matching it as `toPath`.

For example, if we alias `/a` to `/a/b/c`, when we visit `/a`, the browser URL will display `/a`. However, the router will match the path as if we are visiting `/a/b/c` instead.

### Arguments

- `aliasMap {Object}`

  The alias map object should be in the form of { fromPath: toPath, ... }. The paths can contain dynamic segments.

### Returns

- The router instance itself.

### Example

``` js
router.alias({

  // match /a as if it is /a/b/c
  '/a': '/a/b/c',

  // alias can contain dynamic segments
  // the dynamic segment names must match
  '/user/:userId': '/user/profile/:userId'
})
```
