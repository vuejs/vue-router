# Getting Started

<Bit/>

::: tip Note
We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).
:::

Creating a Single-page Application with Vue + Vue Router is dead simple. With Vue.js, we are already composing our application with components. When adding Vue Router to the mix, all we need to do is map our components to the routes and let Vue Router know where to render them. Here's a basic example:

<ExamplePreview name="basic" initial-view="code"/>

By injecting the router, we get access to it as `this.$router` as well as the current route as `this.$route` inside of any component:

```js
// Home.vue
export default {
  computed: {
    username() {
      // We will see what `params` is shortly
      return this.$route.params.username
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
  },
}
```

Throughout the docs, we will often use the `router` instance. Keep in mind that `this.$router` is exactly the same as using `router`. The reason we use `this.$router` is because we don't want to import the router in every single component that needs to manipulate routing.

Notice that a `<router-link>` automatically gets the `.router-link-active` class when its target route is matched. You can learn more about it in its [API reference](../api/#router-link).
