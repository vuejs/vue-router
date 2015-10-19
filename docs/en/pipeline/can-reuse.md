# `canReuse: Boolean | canReuse(transition) -> Boolean`

Determines whether a component can be reused. If a component cannot be reused, the current instance will be replaced by a new one and it will go through the normal validation and activation phase.

This route options can either be a plain Boolean value, or a function that synchronously returns a Boolean. **Defaults to `true`**.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  You can only access `transition.to` and `transition.from` in a `canReuse` hook.

### Expected Return Value

- Must return a Boolean. Falsy values are treated as `false`.

### Details

`canReuse` is called synchronously, top-down for all potentially reusable components.

If a component is reused, its `data` hook will still get called during the activation phase.
