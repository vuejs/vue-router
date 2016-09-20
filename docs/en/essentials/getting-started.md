# Getting Started

Creating a Single-page Application with Vue.js + vue-router is dead simple. With Vue.js, we are already dividing our application into components. When adding vue-router to the mix, all we need to do is map our components to the routes and let vue-router know where to render them. Here's a basic example:

### HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- <router-link> will be rendered as an `<a>` tag by default -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components.
// These can be imported from other files
var Foo = { template: '<div>foo</div>' }
var Bar = { template: '<div>bar</div>' }

// 3. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
var routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 4. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter({
  routes: routes
})

// 5. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
new Vue({
  router: router
}).$mount('#app')

// Now the app has started!
```

You can also checkout this example [live](http://jsfiddle.net/yyx990803/xgrjzsup/).

In addition:

- Notice that a `<router-link>` automatically gets the `.router-link-active` class when its target route is matched. You can learn more about it in its [API reference](../api/router-link.md).

- The root Vue instance will be available as `router.app` once the initial render is complete. You can learn more about the properties and methods available on the router instance [here](../api/router-instance.md).

- The router instance will be available in all descendants of the root instance as `this.$router`. An object representing the current route state will also be available as [this.$route](../api/route-object.md).
