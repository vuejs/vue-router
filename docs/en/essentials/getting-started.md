# Getting Started

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.

Creating a Single-page Application with Vue.js + vue-router is dead simple. With Vue.js, we are already composing our application with components. When adding vue-router to the mix, all we need to do is map our components to the routes and let vue-router know where to render them. Here's a basic example:

> All examples will be using the standalone version of vue to make template parsing possible. See more details [here](http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build)

### HTML (index.html)

``` html
<div id="app">
</div>
<script src="assets/app.js"></script>
```
the id "app" here is for late binding vue.

### JavaScript (app.js)

``` js
// 0. If using a module system, call Vue.use(VueRouter)
// need to redefine the 'alias' config in bundler such as webpack or rollup
import Vue from 'vue'
import VueRouter from 'router'

// 1. Define route components.
// These can be imported from other files
import App from './components/App.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for routes: routes
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  el: '#app'
  router: router,
  render: h => h(App)
})

// Now the app has started!
```

### Vue (app.vue)

```  html
<template>
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
</template>
<script>
export default {
  // can ignore the parameters first, however must export this function
}
</script>
```

You can also checkout this example [live](http://jsfiddle.net/yyx990803/xgrjzsup/).

Notice that a `<router-link>` automatically gets the `.router-link-active` class when its target route is matched. You can learn more about it in its [API reference](../api/router-link.md).
