# Passing Props to Route Components

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-pass-vue-router-params-as-props-to-components?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to pass props to route components with Vue School">Learn how to pass props to route components with a free lesson on Vue School</a></div>

Using `$route` in your component creates a tight coupling with the route which limits the flexibility of the component as it can only be used on certain URLs.

To decouple this component from the router use option `props`:

**Instead of coupling to `$route`:**

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})
```

**Decouple it by using `props`**

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // for routes with named views, you have to define the `props` option for each named view:
    {
      path: '/user/:id',
      components: {
        default: User,
        sidebar: Sidebar
      },
      props: {
        default: true,
        // function mode, more about it below
        sidebar: route => ({ search: route.query.q })
      }
    }
  ]
})
```

This allows you to use the component anywhere, which makes the component easier to reuse and test.

## Boolean mode

When `props` is set to `true`, the `route.params` will be set as the component props.

## Object mode

When `props` is an object, this will be set as the component props as-is. Useful for when the props are static.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false }
    }
  ]
})
```

## Function mode

You can create a function that returns props. This allows you to cast parameters into other types, combine static values with route-based values, etc.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
```

The URL `/search?q=vue` would pass `{query: 'vue'}` as props to the `SearchUser` component.

Try to keep the `props` function stateless, as it's only evaluated on route changes. Use a wrapper component if you need state to define the props, that way vue can react to state changes.

For advanced usage, check out the [example](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
