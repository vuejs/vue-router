# Getting Started

<Bit/>

Creating a Single-page Application with Vue + Vue Router is dead simple. With Vue.js, we are already composing our application with components. When adding Vue Router to the mix, all we need to do is map our components to the routes and let Vue Router know where to render them. Here's a basic example:

<ExamplePreview name="basic" initial-view="code"/>

::: tip Interactive Demos
What you see above is an interactive demo. You will see some of these throughout the docs, here are some usage guidelines:

- You can see the result live in the demo above by clicking the <ExamplePreviewBarButton icon="play-window" tabindex="-1"/> in the top-right corner.
- The <ExamplePreviewBarButton icon="codesandbox" tabindex="-1"/> button opens a CodeSandbox so you can edit and play around with the code.
- While interacting with the demo you can directly modify the URL and press _enter_ to visit a specific url or navigate through the history by using the <ExamplePreviewBarButton icon="left-arrow" tabindex="-1"/> and <ExamplePreviewBarButton icon="right-arrow" tabindex="-1"/> buttons.
- You can come back to the files by clicking the <ExamplePreviewBarButton icon="brackets" tabindex="-1"/> button.
  :::

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
