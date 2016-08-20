# router-link

`router-link` is the component for enabling user navigation in a router-enabled app. It accepts a `prop` named 'to' which will be passed to `router.push()` internally. It will be rendered as an `<a>` tag by default. For example:

``` html
<!-- literal string -->
<router-link to="home">Home</router-link>
<!-- renders to -->
<a href="home">Home</a>

<!-- javascript expression using v-bind -->
<router-link v-bind:to="'home'">Home</router-link>

<!-- Omitting v-bind is fine, just as binding any other prop -->
<router-link :to="'home'">Home</router-link>

<!-- same as above -->
<router-link :to="{ path: 'home' }">Home</router-link>

<!-- named route -->
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

<!-- with query, resulting in /register?plan=private -->
<router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
```

`<router-link to="...">` is preferred over hard-coded `<a href="...">` for the following reasons:

- It works the same way in both HTML5 history mode and hash mode, so if you ever decide to switch mode, or when the router falls back to hash mode in IE9, nothing needs to be changed.

- In HTML5 history mode, `router-link` will intercept the click event so that the browser doesn't try to reload the page.

- When you are using the `base` option in HTML5 history mode, you don't need to include it in `to` prop's URLs.

#### Active Link Class

`<router-link>` components will automatically get corresponding class names when the current path matches its `to` prop's URL. The default class to be applied is `.router-link-active` and the default matching behavior is **inclusive match**. For example, `<router-link to="/a">` will get this class applied as long as the current path starts with `/a`.

It is also possible to configure the matching behavior so that the active class is only applied when the paths match exactly, by using the `exact` prop.

``` html
<router-link :to="{ path: '/a'}" :exact="true"></router-link>
<!-- or simply -->
<router-link :to="{ path: '/a'}" exact></router-link>
```

The active link class name can be configured with the `linkActiveClass` option when creating the router instance. It can also be overridden with the `activeClass` prop:

``` html
<router-link :to="{ path: '/a'}" active-class="custom-active-class"></router-link>
```

Checkout more examples explaining active link class [live](http://jsfiddle.net/fnlCtrl/dokbyypq/)

#### Other Configuration Props

- **replace**

  Setting `replace` prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will not leave a history record.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  Setting `append` prop always appends the relative path to the current path. For example, assuming we are navigating from `/a` to a relative link `b`, without `append` we will end up at `/b`, but with `append` we will end up at `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  Sometimes we want `<router-link>` to render as another tag, for example, `<div>`. Then we can use `tag` prop to specify which tag to render to, and it will still listen to click events for navigation.

  ``` html
  <router-link to="/abc" tag="div">ABC</router-link>
  <!-- renders as -->
  <div>ABC</div>
  ``` 

  Please note that `tag` can only be native html tag. If you pass a component name like `foo`, `<router-link>` will render as a `<foo>` component, but won't be able to pass any prop to `foo`.
  