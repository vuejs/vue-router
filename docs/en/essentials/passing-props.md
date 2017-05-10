# Passing Props to Route Components (En) <br><br> *Cette page est en cours de traduction française. Revenez une autre fois pour lire une traduction achevée ou [participez à la traduction française ici](https://github.com/vuejs-fr/vue-router).*

Using `$route` in your component creates a tight coupling with the route which limits the flexibility of the component as it can only be used on certain urls.

To decouple this component from the router use props:

**❌ Coupled to $route**

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

**👍 Decoupled with props**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true }
    
    // for routes with named views, you have to define the props option for each named view:
    {
      path: '/user/:id', 
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

This allows you to use the component anywhere, which makes the component easier to reuse and test.

### Boolean mode

When props is set to true, the route.params will be set as the component props.

### Object mode

When props is an object, this will be set as the component props as-is.
Useful for when the props are static.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Function mode

You can create a function that returns props.
This allows you to cast the parameter to another type, combine static values with route-based values, etc.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

The url: `/search?q=vue` would pass `{query: "vue"}` as props to the SearchUser component.

Try to keep the props function stateless, as it's only evaluated on route changes.
Use a wrapper component if you need state to define the props, that way vue can react to state changes.


For advanced usage, checkout the [example](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
