# Named Routes

<div class="vueschool"><a href="https://vueschool.io/lessons/vue-router-named-routes-and-params?friend=vuerouter" target="_blank" rel="sponsored noopener" title="Learn how to work with named routes and params with Vue School">Learn how to use named routes and params with a free lesson on Vue School</a></div>

Sometimes it is more convenient to identify a route with a name, especially when linking to a route or performing navigations. You can give a route a name in the `routes` options while creating the Router instance:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

To link to a named route, you can pass an object to the `router-link` component's `to` prop:

```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

This is the exact same object used programmatically with `router.push()`:

```js
router.push({ name: 'user', params: { userId: 123 } })
```

In both cases, the router will navigate to the path `/user/123`.

Full example [here](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
