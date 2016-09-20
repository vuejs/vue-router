# Basic Usage

Creating a Single-page Application with Vue.js + vue-router is dead simple. With Vue.js, we are already dividing our application into components. When adding vue-router to the mix, all we need to do is map our components to the routes and let vue-router know where to render them. Here's a basic example:

### HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- <router-link> will be rendered as an `<a>` tag by default -->
    <router-link :to="{ path: '/foo' }">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components
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
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
// The root instance will mount to
// the element matching the selector #app.
new Vue({
  router: router
}).$mount('#app')

// Now the app has started!
```

You can also checkout this example [live](http://jsfiddle.net/fnlCtrl/t49c0mqz/).

In addition:

- The root Vue instance will be available as `router.app` once the initial render is complete.

- The router instance will be available in all descendants of the root instance as `this.$router`.
