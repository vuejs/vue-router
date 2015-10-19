# `canActivate(transition) [-> Promise | Boolean]`

Called on an incoming component during the validation phase.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  Call `transition.next()` to resolve the hook. Calling `transition.abort()` will invalidate and cancel the transition.

### Expected Return Value

- Optionally return a Promise:

  - `resolve(true)` -> `transition.next()`
  - `resolve(false)` -> `transition.abort()`
  - `reject(reason)` -> `transition.abort(reason)`


- Optionally return a Boolean:

  - `true` -> `transition.next()`
  - `false` -> `transition.abort()`

### Details

This hook is called top-down. A child view's `canActivate` will only get called when its parent view's `canActivate` has been resolved.
