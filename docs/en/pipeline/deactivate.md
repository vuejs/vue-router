# `deactivate(transition) [-> Promise]`

Called on a leaving component the activation phase when it is about to be deactivated and removed.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  Call `transition.next()` to resolve the hook. Note calling `transition.abort()` here will not take the app back to the previous route because the transition has already been validated.

### Expected Return Value

- Optionally return a Promise.
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### Details

This hook is called from bottom-up. A parent view component's `deactivate` only gets called when its child's `deactivate` has resolved.

New components' `activate` hooks will only get called when all current components' `deactivate` hooks have been resolved.
