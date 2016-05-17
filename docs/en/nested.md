# Nested Routes

Mapping nested routes to nested components is a common need, and it is also very simple with vue-router.

Suppose we have the following app:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

The `<router-view>` here is a top-level outlet. It renders the component matched by a top level route:

``` js
router.map({
  '/foo': {
    // Foo is rendered when /foo is matched
    component: Foo
  }
})
```

Similarly, a rendered component can also contain its own, nested `<router-view>`. For example, if we add one inside the `Foo` component's template:

``` js
var Foo = {
  template:
    '<div class="foo">' +
      '<h2>This is Foo!</h2>' +
      '<router-view></router-view>' + // <- nested outlet
    '</div>'
}
```

To render components into this nested outlet, we need to update our route config:

``` js
router.map({
  '/foo': {
    component: Foo,
    // add a subRoutes map under /foo
    subRoutes: {
      '/bar': {
        // Bar will be rendered inside Foo's <router-view>
        // when /foo/bar is matched
        component: Bar
      },
      '/baz': {
        // Same for Baz, but only when /foo/baz is matched
        component: Baz
      }
    }
  }
})
```

Now, with the above configuration, when you visit `/foo`, nothing will be rendered inside `Foo`'s outlet, because no sub route is matched. Maybe you do want to render something there. In such case you can provide a `/` subroute in this case:

``` js
router.map({
  '/foo': {
    component: Foo,
    subRoutes: {
      '/': {
        // This component will be rendered into Foo's <router-view>
        // when /foo is matched. Using an inline component definition
        // here for convenience.
        component: {
          template: '<p>Default sub view for Foo</p>'
        }
      },
      // other sub routes...
    }
  }
})
```

A working demo of this example can be found [here](http://jsfiddle.net/yyx990803/naeg67da/).
