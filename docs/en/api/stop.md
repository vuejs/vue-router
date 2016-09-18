# `router.stop()`

Stop listening to `popstate` and `hashchange` events.

Note that when a router is in stopped state, `router.app` is not destroyed and you can still navigate around using `router.go(path)`. You can also restart the router by calling `router.start()` again with no arguments.
