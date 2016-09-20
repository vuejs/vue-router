# Named Views

Sometimes you need to display multiples views at the same time instead of nesting them, e.g. creating a layout with a `sidebar` view and a `main` view. This is where named views came in handy. Instead of having one single outlet in your view, you can have multiple and give each of them a name. A `router-view` without a name will be given `default` as its name.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

A view is rendered by using a component, therefore multiple views require multiple components for the same route. Make sure to use the `components` (with
an s) option:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

A working demo of this example can be found
[here](https://jsfiddle.net/posva/9b80nxx1/).
