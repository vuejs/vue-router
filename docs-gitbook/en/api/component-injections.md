# Component Injections

### Injected Properties

These properties are injected into every child component by passing the router instance to the root instance as the `router` option.

- #### $router

  The router instance.

- #### $route

  The current active [Route](route-object.md). This property is read-only and its properties are immutable, but it can be watched.

### Enabled Options

- **beforeRouteEnter**
- **beforeRouteUpdate** (added in 2.2)
- **beforeRouteLeave**

  See [In Component Guards](../advanced/navigation-guards.md#incomponent-guards).
