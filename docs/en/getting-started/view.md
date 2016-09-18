# `<router-view>`

The `<router-view>` element is used as outlets for rendering matched components. It is based upon Vue's dynamic component system, and therefore inherits many features from a normal dynamic component:

- You can pass props to it.
- HTML content inside the `<router-view>` will be used for content insertion in the rendered component.
- `transition` and `transition-group` are fully supported. Read more about the transition system [here](https://github.com/vuejs/vue/releases/tag/v2.0.0-beta.2) //TODO: Use Vue 2.0 documentation link instead of release notes
- `ref` is also supported; The rendered component will be registered in the parent component's `this.$refs` object.
- `keep-alive` is supported, though there are some [caveats]() // TODO: Use Vue 2.0 documentation link about keep-alive