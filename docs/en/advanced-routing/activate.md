# Async Routes

Sometimes you need to fetch data from server before rendering a route. For
example, before visiting a user profile, you have to fetch his data from the
server. In vue-router <= 1, you'd use the `activate` hook. From version 2 we
rely on the components life-cycle to fetch data.

This way you can control how loading is handled in each view.


TODO talk about fetching in created hook

TODO talk about using the beforeEnter option in route definition

Going somewhere else in the before next is called will cancel it (explain with example)


# `activate(transition) [-> Promise]`

Called on an incoming component during the activation phase when it is created and about to get transitioned in.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  Call `transition.next()` to resolve the hook. Note calling `transition.abort()` here will not take the app back to the previous route because the transition has already been validated.

### Expected Return Value

- Optionally return a Promise.
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### Details

In most cases this hook is used to control the timing of the view switching, because the view switching will not happen until this hook is resolved.

This hook is called top-down. A child view's `activate` will only get called when its parent view's `activate` has been resolved.
