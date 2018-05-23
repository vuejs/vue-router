# `<router-link>`

`<router-link>` is the component for enabling user navigation in a router-enabled app. The target location is specified with the `to` prop. It renders as an `<a>` tag with correct `href` by default, but can be configured with the `tag` prop. In addition, the link automatically gets an active CSS class when the target route is active.

`<router-link>` is preferred over hard-coded `<a href="...">` for the following reasons:

- It works the same way in both HTML5 history mode and hash mode, so if you ever decide to switch mode, or when the router falls back to hash mode in IE9, nothing needs to be changed.

- In HTML5 history mode, `router-link` will intercept the click event so that the browser doesn't try to reload the page.

- When you are using the `base` option in HTML5 history mode, you don't need to include it in `to` prop's URLs.

### Props

- **to**

  - type: `string | Location`

  - required

  Denotes the target route of the link. When clicked, the value of the `to` prop will be passed to `router.push()` internally, so the value can be either a string or a location descriptor object.

  ``` html
  <!-- literal string -->
  <router-link to="home">Home</router-link>
  <!-- renders to -->
  <a href="home">Home</a>

  <!-- javascript expression using `v-bind` -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- Omitting `v-bind` is fine, just as binding any other prop -->
  <router-link :to="'home'">Home</router-link>

  <!-- same as above -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- named route -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- with query, resulting in `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - type: `boolean`

  - default: `false`

  Setting `replace` prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will not leave a history record.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - type: `boolean`

  - default: `false`

  Setting `append` prop always appends the relative path to the current path. For example, assuming we are navigating from `/a` to a relative link `b`, without `append` we will end up at `/b`, but with `append` we will end up at `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - type: `string`

  - default: `"a"`

  Sometimes we want `<router-link>` to render as another tag, e.g `<li>`. Then we can use `tag` prop to specify which tag to render to, and it will still listen to click events for navigation.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- renders as -->
  <li>foo</li>
  ```

- **active-class**

  - type: `string`

  - default: `"router-link-active"`

  Configure the active CSS class applied when the link is active. Note the default value can also be configured globally via the `linkActiveClass` router constructor option.

- **exact**

  - type: `boolean`

  - default: `false`

  The default active class matching behavior is **inclusive match**. For example, `<router-link to="/a">` will get this class applied as long as the current path starts with `/a/` or is `/a`.

  One consequence of this is that `<router-link to="/">` will be active for every route! To force the link into "exact match mode", use the `exact` prop:

  ``` html
  <!-- this link will only be active at `/` -->
  <router-link to="/" exact>
  ```

  Check out more examples explaining active link class [live](https://jsfiddle.net/8xrk1n9f/).

- **event**

  > 2.1.0+

  - type: `string | Array<string>`

  - default: `'click'`

  Specify the event(s) that can trigger the link navigation.

- **exact-active-class**

  > 2.5.0+

  - type: `string`

  - default: `"router-link-exact-active"`

  Configure the active CSS class applied when the link is active with exact match. Note the default value can also be configured globally via the `linkExactActiveClass` router constructor option.

### Applying Active Class to Outer Element

Sometimes we may want the active class to be applied to an outer element rather than the `<a>` tag itself, in that case, you can render that outer element using `<router-link>` and wrap the raw `<a>` tag inside:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

In this case the `<a>` will be the actual link (and will get the correct `href`), but the active class will be applied to the outer `<li>`.
