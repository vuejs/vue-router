# `router.go(path)`

Programatically navigate to a new route.

### Arguments

- `path: String | Object`

  The path can be either a String or an Object.

  If a String, the path must be a plain path (i.e. no dynamic segments or star segments). The path doesn't start with `/`, it will be resolved relative to the current active path.

  If an Object, it can either be in the form of:

  ``` js
  { path: '...' }
  ```

  Or:

  ``` js
  {
    name: '...',
    // params and query are optional
    params: { ... },
    query: { ... }
  }
  ```

  For details about the `name` Object format, see [Named Routes](../named.md).
