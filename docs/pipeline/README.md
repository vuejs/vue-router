# Transition Pipeline

Route components can configure its transition and data-loading behavior by implementing appropriate transition pipeline hooks. These hooks include:

- `data`
- `activate`
- `deactivate`
- `canActivate`
- `canDeactivate`
- `canReuse`

When a route transition is triggered, these hooks will be called in a specific order on affected view components.

A route transition can be divided into three phases:

1. **Reusability phase:**

  Check if any component in the current view hierarchy can be reused in the new one.

2. **Validation phase:**

  Check if all current components can be deactivated, and if all new components can be activated.

3. **Activation phase:**

  Deactivate current components and activate new components.

The diagram below demonstrates the full pipeline of a route transition:
