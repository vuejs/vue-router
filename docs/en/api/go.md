# `router.go(path)`

Programatically navigate to a new route.

### Arguments

- `path: String | Object`

  The path can be either a String or an Object.

  If a String, the path must be a plain path (i.e. no dynamic segments or star segments). If the path doesn't start with `/`, it will be resolved relative to the current active path.

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

  - When using the `path` format and navigating to a relative path, you can also pass in the `append: true` option, so that the relative path is always **appended** to the current path. For example:

    - Going from `/a` to `b` without `append: true` will arrive at `/b`.

    - Going from `/a` to `b` with `append: true` will arrive at `/a/b`.

  - Both formats also accept the `replace: true` option, which makes the navigation to replace the current history entry instead of creating a new one.
