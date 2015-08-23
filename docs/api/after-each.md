# `router.afterEach(hook)`

Set the global after hook, which will be called every time when a route transition successfully **enters the activation phase**.

Note this hook being called only means the transition has been validated, i.e. all `canDeactivate` and `canActivate` hooks have successfully resolved and the browser URL has been updated. It does not guarantee that all `activate` hooks have been resolved.

You can only have one global after hook at a time; however you can implement your own middleware system inside this hook.

### Arguments

- `hook {Function}`

  The hook function receives a single argument which is a [Transition Object](../pipeline/hooks.html#transition-object), but you can only access its `to` and `from` properties, which are route objects. You **cannot** call transition methods in the global after hook.

### Example

``` js
router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path)
})
```
