# Router Instance Properties

> Only public properties are documented here.

### `router.app`

- type: `Vue`

  The root Vue instance managed by the router instance. This instance is created from the Vue component contructor you passed into `router.start()`. Note it may not be synchronously available when if router has to perform a redirect on load. If you need access to `router.app` outside of your app components, you may want to do so inside the callback passed to `router.start()`.

### `router.mode`

- type: `String`

  One of `html5`, `hash` or `abstract`.

  - **`html5`**: uses HTML5 history API and listens to `popstate` events. Supports [`saveScrollPosition`](../options.html#savescrollposition).

  - **`hash`**: uses `location.hash` and listens to `hashchange` events. When you specify `history: true` when creating the router, it will fallback into hash mode in browsers that do not support the history API.

  - **`abstract`**: does not listen to any events. Will auto-fallback into this mode if `window` is not present.
