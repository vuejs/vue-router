# `router.redirect(redirectMap)`

Configures global redirection rules for the router. Global redirections are performed before matching the current path. If a redirection is found, the originally visited path will simply be skipped and will not leave a record in the history.

### Arguments

- `redirectMap: Object`

  The redirect map object should be in the form of `{ fromPath: toPath, ... }`. The paths can contain dynamic segments.

### Example

``` js
router.rediect({

  // redirect any navigation to /a to /b
  '/a': '/b',

  // redirect can contian dynamic segments
  // the dynamic segment names must match
  '/user/:userId': '/profile/:userId'
})
```
