# Route Options

There are a number of options you can use to customize the router behavior when creating a router instance.

#### mode

- default: `"hash"`

  There are three modes that can be set on the router

  - `hash`: All paths will be formatted to start with #. For example router.go('/foo/bar') will set the browser URL to example.com/#/foo/bar.

  - `history`: Enables HTML5 history mode. Leverages history.pushState() and history.replaceState() for history management.

      **Note**: when using the history mode, the server needs to be [properly configured](server.md) so that a user directly visiting a deep link on your site doesn't get a 404.

      **Note**: if you plan to serve your files with the `file://` protocol (for example, when using with [Electron](electron.atom.io)), enabling this mode will break your app. That is because your app URLs would look like `file:///path/to/your/app/index.html/my-route/`, which makes no sense in UNIX filesystem architecture.

  - `abstract`: Use an abstract history backend that doesn't rely on the browser. The abstract mode is useful in testing or in environments where actual URLs doesn't matter, for example in Electron or Cordova apps. The router will also fallback into abstract mode if loaded in a non-browser environment.

#### root

- default: null
- only used in HTML5 history mode

  Define a root path for all router navigations. All paths used in route configurations, `router.go()`, `v-link` and exposed on route objects will be resolved relative to this root path, and the root path will always be included in the actual browser URL.

  For example, with `root: '/foo'`, `v-link="/bar"` will set the browser URL to `/foo/bar`. Directly visiting `/foo/bar` will match against `/bar` in your route config.

  In most cases, `root` is set-and-forget: you don't have to worry about it in your application code.

#### linkActiveClass

- default: `"v-link-active"`

  Configures the class to be applied to `v-link` elements when the current link is active. The matching behavior and the class can also be individually configured for each `v-link`.

#### saveScrollPosition

- default: false
- only used in HTML5 history mode

  This option leverages the state associated with an HTML5 history `popstate` event to restore the scroll position when the user hits the back button. Note this might not work as expected if your `<router-view>` has transition effects.

#### transitionOnLoad

- default: false

  Whether to apply transition effect for `<router-view>`s on initial load. By default the components matched on initial load are rendered instantly.

#### suppressTransitionError

- default: false

  If set to `true`, uncaught errors inside transition hooks will be suppressed.
