# v-link

`v-link` is the directive for enabling user navigation in a router-enabled app. It accepts a JavaScript expression which will be passed to `router.go()` internally. For example:

``` html
<!-- literal string -->
<a v-link="'home'">Home</a>

<!-- same as above -->
<a v-link="{ path: 'home' }">Home</a>

<!-- named route -->
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>

<!-- with query, resulting in /register?plan=private -->
<a v-link="{ path: 'register', query: { plan: 'private' }}">Register</a>
```

`v-link` is preferred over hard-coded `href` for the following reasons:

- It works the same way in both HTML5 history mode and hash mode, so if you ever decide to switch mode, or when the router falls back to hash mode in IE9, nothing needs to be changed.

- In HTML5 history mode, `v-link` will intercept the click event so that the browser doesn't try to reload the page.

- When you are using the `root` option in HTML5 history mode, you don't need to include it in `v-link` URLs.

#### Active Link Class

Elements with `v-link` will automatically get corresponding class names when the current path matches its `v-link` URL. The default class to be applied is `.v-link-active` and the default matching behavior is **inclusive match**. For example, an element with `v-link="/a"` will get this class applied as long as the current path starts with `/a`.

It is also possible to configure the matching behavior so that the active class is only applied when the paths match exactly, using the `exact` inline option:

``` html
<a v-link="{ path: '/a', exact: true }"></a>
```

The active link class name can be configured with the `linkActiveClass` option when creating the router instance. It can also be overridden with the `activeClass` inline option:

``` html
<a v-link="{ path: '/a', activeClass: 'custom-active-class' }"></a>
```

#### Applying Active Classes to Another Element

> 0.7.8+

Sometimes we may want the active classes to be applied to a wrapping element rather than the `<a>` element itself. You can do so by adding `v-link-active` to a parent element:

``` html
<ul>
  <li v-link-active>
    <a v-link="{ path: '/xxx' }">Go</a>
  </li>
</ul>
```

`v-link` will locate the closest parent element that has `v-link-active` and apply the active classes on that element instead.

#### Other Configuration Options

- **replace**

  A link with `replace: true` will call `router.replace()` instead of `router.go()` when clicked, so the navigation will not leave a history record.

  ``` html
  <a v-link="{ path: '/abc', replace: true }"></a>
  ```

- **append**

  A relative link with `append: true` always appends the relative path to the current path. For example, assuming we are navigating from `/a` to a relative link `b`, without `append: true` we will end up at `/b`, but with `append: true` we will end up at `/a/b`.

  ``` html
  <a v-link="{ path: 'relative/path', append: true }"></a>
  ```

#### Additional Notes

- `v-link` automatically sets the `href` attribute when used on an `<a>` element.
