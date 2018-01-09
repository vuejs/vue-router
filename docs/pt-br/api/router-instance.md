# The Router Instance

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
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

  Add global navigation guards. See [Navigation Guards](../advanced/navigation-guards.md).

  In 2.5.0+ all three methods return a function that removes the registered guard/hook.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Programmatically navigate to a new URL. See [Programmatic Navigation](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Returns an Array of the components (definition/constructor, not instances) matched by the provided location or the current route. This is mostly used during server-side rendering to perform data prefetching.

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

  - `current` is the current Route by default (most of the time you don't need to change this)
  - `append` allows you to append the path to the `current` route (as with [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  Dynamically add more routes to the router. The argument must be an Array using the same route config format with the `routes` constructor option.

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  This method queues a callback to be called when the router has completed the initial navigation, which means it has resolved all async enter hooks and async components that are associated with the initial route.

  This is useful in server-side rendering to ensure consistent output on both the server and the client.

  The second argument `errorCallback` is only supported in 2.4+. It will be called when the initial route resolution runs into an error (e.g. failed to resolve an async component).

- **router.onError(callback)**

  > 2.4.0+

  Register a callback which will be called when an error is caught during a route navigation. Note for an error to be called, it must be one of the following scenarios:

  - The error is thrown synchronously inside a route guard function;

  - The error is caught and asynchronously handled by calling `next(err)` inside a route guard function;

  - An error occurred when trying to resolve an async component that is required to render a route.
