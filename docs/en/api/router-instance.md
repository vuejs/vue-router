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


- **router.push(location)**
- **router.replace(location)**
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
    normalizedTo: Location;
    resolved: Route;
    href: string;
  }
  ```
