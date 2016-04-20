# `router.replace(path)`

Similar to `router.go(path)`, but doesn't create a new record in browser history.

### Arguments

- `path: String`

  The path must be a plain path (i.e. no dynamic segments or star segments). If the path doesn't start with `/`, it will be resolved relative to the current active path.
