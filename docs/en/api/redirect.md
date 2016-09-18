# `router.redirect(redirectMap)`

Configures global redirection rules for the router. Global redirections are performed before matching the current path. If a redirection is found, the originally visited path will simply be skipped and will not leave a record in the browser history.

### Arguments

- `redirectMap: Object`

  The redirect map object should be in the form of `{ fromPath: toPath, ... }`. The paths can contain dynamic segments.

### Returns

- The router instance itself.

### Example

``` js
router.redirect({

  // redirect any navigation to /a to /b
  '/a': '/b',

  // redirect can contain dynamic segments
  // the dynamic segment names must match
  '/user/:userId': '/profile/:userId',

  // redirect any not-found route to home
  '*': '/home'
})
```
