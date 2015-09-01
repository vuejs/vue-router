# `router.beforeEach(hook)`

Set the global before hook, which will be called before every route transition starts. This is before the entire transition pipeline; if the hook rejects the transition, the pipeline won't even be started.

Note you can only have one global before hook at a time; however you can implement your own middleware system inside this hook.

### Arguments

- `hook {Function}`

  The hook function receives a single argument which is a [Transition Object](../pipeline/hooks.html#transition-object).

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
