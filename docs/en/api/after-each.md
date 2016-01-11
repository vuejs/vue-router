# `router.afterEach(hook)`

Add a global after hook, which will be called every time when a route transition successfully **enters the activation phase**.

Note this hook being called only means the transition has been validated, i.e. all `canDeactivate` and `canActivate` hooks have successfully resolved and the browser URL has been updated. It does not guarantee that all `activate` hooks have been resolved.

You can add multiple global after hooks to the same router. These hooks will be called synchronously in the order of creation.

### Arguments

- `hook {Function}`

  The hook function receives a single argument which is a [Transition Object](../pipeline/hooks.html#transition-object), but you can only access its `to` and `from` properties, which are route objects. You **cannot** call transition methods in the global after hook.

### Returns

- The router instance itself.

### Example

``` js
router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path)
})
```
