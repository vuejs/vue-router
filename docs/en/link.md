# v-link

`v-link` is the directive for enabling user navigation in a router-enabled app. It accepts a JavaScript expression which will be passed to `router.go()` internally. For example:

``` html
<!-- literal string -->
<a v-link="'home'">Home</a>

<!-- same as above -->
<a v-link="{ path: 'home' }">Home</a>

<!-- named route -->
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

`v-link` is preferred over hard-coded `href` for the following reasons:

- It works the same way in both HTML5 history mode and hash mode, so if you ever decide to switch mode, or when the router falls back to hash mode in IE9, nothing needs to be changed.

- In HTML5 history mode, `v-link` will intercept the click event so that the browser doesn't try to reload the page.

- When you are using the `root` option in HTML5 history mode, you don't need to include it in `v-link` URLs.

#### Active Link Class

Elements with `v-link` will automatically get corresponding class names when the current path matches its `v-link` URL:

- The `.v-link-active` class is applied to the element when the current path starts with the `v-link` URL. For example, an element with `v-link="/a"` will get this class as long as the current path starts with `/a`.

- The `.v-link-active-exact` class is applied when the current path is an exact match of the `v-link` URL.

The active link class name can be configured with the `activeLinkClass` option when creating the router instance. The exact match class simply appends `-exact` postfix to the provided class name.

#### Additional Notes

- `v-link` automatically sets the `href` attribute when used on an `<a>` element.
