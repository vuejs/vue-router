# `router.start(App, el, [callback])`

Start the router-enabled app. Creates an instance of `App` and mounts it to `el`.

### Arguments

- `App: Function | Object`

  The `App` can be a Vue component constructor or a component options object. If it's an object, the router will implicitly call `Vue.extend` on it. This component will be used to create the root Vue instance for the app.

  **Note:**
  vue-router cannot be started with Vue instances.

- `el: String | Element`

  The element to mount the app on. Can be a CSS selector string or an actual element.

- `callback: Function` (optional)

  A callback which will be called when the router app's initial render is complete. `router.app` is guaranteed to be available after this callback is called.
