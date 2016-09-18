# `router.beforeEach(hook)`

Add a global before hook to the router, which will be called before every route transition starts. This is before the entire transition pipeline; if the hook rejects the transition, the pipeline won't even be started.

You can add multiple global before hooks to the same router. These hooks will be called in the order of creation. Since hooks can be resolved asynchronously, the next hook won't be called until the previous one resolves.

Global before hooks are resolved following the same [Hook resolution rules](../pipeline/hooks.html#hook-resolution-rules).

### Arguments

- `hook {Function}`

  The hook function receives a single argument which is a [Transition Object](../pipeline/hooks.html#transition-object).

### Returns

- The router instance itself.

### Example

Basic

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

Promise + ES6

``` js
router.beforeEach(function ({ to, next }) {
  if (to.path === '/auth-required') {
    // return a Promise that resolves to true or false
    return AuthService.isLoggedIn()
  } else {
    next()
  }
})
```
