# Nested Routes

Mapping nested routes to nested components is a common need, and it is also very
simple with vue-router.

Suppose we have the following app:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

The `<router-view>` here is a top-level outlet. It renders the component matched
by a top level route:

``` js
var Foo = { template: '<div>Foo</div>' }
const router = new VueRouter({
  routes: [
    // Foo is rendered when /foo is matched
    {
      path: '/foo',
      component: Foo
    }
  ]
})
```

Similarly, a rendered component can also contain its own, nested
`<router-view>`. For example, if we add one inside the `Foo` component's
template:

``` js
var Foo = {
  template: `
    <div class="foo">
      <h2>This is Foo!</h2>
      <router-view></router-view>
    </div>
  `
}
```

To render components into this nested outlet, we need to use the `children`
option in `VueRouter` constructor config:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo
      children: [
        {
          // Bar will be rendered inside Foo's <router-view>
          // when /foo/bar is matched
          path: '/bar',
          component: Bar
        },
        {
          // Bar will be rendered inside Foo's <router-view>
          // when /foo/bar is matched
          path: '/bar',
          component: Bar
        }
      ]
    }
  ]
})
```

As you can see the `children` option has pretty much the same format as the
`routes` option. Therefore, you can keep nesting views as much as you need.

At this point, with the above configuration, when you visit `/foo`, nothing will be
rendered inside `Foo`'s outlet, because no sub route is matched. Maybe you do
want to render something there. In such case you can provide an empty subroute path:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo
      children: [
        // Default will be rendered inside Foo's <router-view>
        // when /foo is matched
        { path: '', component: Default },
        // other sub routes
      ]
    }
  ]
})
```

A working demo of this example can be found [here](https://jsfiddle.net/posva/wuczg0av/).
