# Route Options

There are a number of options you can use to customize the router behavior when creating a router instance.

#### hashbang

- default: true
- only used in hash mode

  When the hashbang option is true, all hash paths will be formated to start with `#!`. For example `router.go('/foo/bar')` will set the browser URL to `example.com/#!/foo/bar`.

#### history

- default: false

  Enables HTML5 history mode. Leverages `history.pushState()` and `history.replaceState()` for history management.

  **Note**: when using the history mode, the server needs to be [properly configured](http://readystate4.com/2012/05/17/nginx-and-apache-rewrite-to-support-html5-pushstate/) so that a user directly visiting a deep link on your site doesn't get a 404.

####  abstract

- default: false

  Use an abstract history backend that doesn't rely on the browser. The abstract mode is useful in testing or in environments where actual URLs doesn't matter, for example in Electron or Cordova apps. The router will also fallback into abstract mode if loaded in a non-browser environment.

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
