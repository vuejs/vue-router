# `<router-view>`

The `<router-view>` element is used as outlets for rendering matched components. It is based upon Vue's dynamic component system, and therefore inherits many features from a normal dynamic component:

- You can pass props to it.
- HTML content inside the `<router-view>` will be used for content insertion in the rendered component.
- `transition` and `transition-mode` are fully supported. Note: for transition effects to work, your route component must not be a [fragment instance](http://vuejs.org/guide/components.html#Fragment_Instance).
- `v-ref` is also supported; The rendered component will be registered in the parent component's `this.$` object.

However, there are also a few limitations:

- ~~`keep-alive` is not supported as of now.~~ `keep-alive` now has experimental support in 0.7.2+.
- `wait-for` is not supported. You should be using the [`activate` transition hook](pipeline/activate.html) to control the timing of the transition.
