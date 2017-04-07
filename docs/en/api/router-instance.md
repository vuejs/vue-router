# Router Instance

### Properties

#### router.app

- type: `Vue instance`

  The root Vue instance the `router` was injected into.

#### router.mode

- type: `string`

  The [mode](options.md#mode) the router is using.

#### router.currentRoute

- type: `Route`

  The current route represented as a [Route Object](route-object.md).

### Methods

- **router.beforeEach(guard)**
- **router.afterEach(hook)**

  Add global navigation guards. See [Navigation Guards](../advanced/navigation-guards.md).


- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Programmatically navigate to a new URL. See [Programmatic Navigation](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Returns an Array of the components (definition/constructor, not instances) matched by the provided location or the current route. This is mostly used during server-side rendering to perform data prefetching. Resolved props are available on `$props` for each component.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  Reverse URL resolving. Given location in form same as used in `<router-link/>`, returns object with the following resolved properties:

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

- **router.addRoutes(routes)**

  > 2.2.0+

  Dynamically add more routes to the router. The argument must be an Array using the same route config format with the `routes` constructor option.

- **router.onReady(callback)**

  > 2.2.0+

  This method queues a callback to be called when the router has completed the initial navigation, which means it has resolved all async enter hooks and async components that are associated with the initial route.

  This is useful in server-side rendering to ensure consistent output on both the server and the client.
