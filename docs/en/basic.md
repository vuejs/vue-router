# Basic Usage

Creating a Single-page Application with Vue.js + vue-router is dead simple. With Vue.js, we are already dividing our application into components. When adding vue-router to the mix, all we need to do is map our components to the routes and let vue-router know where to render them. Here's a basic example:

### HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use v-link directive for navigation. -->
    <a v-link="{ path: '/foo' }">Go to Foo</a>
    <a v-link="{ path: '/bar' }">Go to Bar</a>
  </p>
  <!-- route outlet -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// Define some components
var Foo = Vue.extend({
    template: '<p>This is foo!</p>'
})

var Bar = Vue.extend({
    template: '<p>This is bar!</p>'
})

// The router needs a root component to render.
// For demo purposes, we will just use an empty one
// because we are using the HTML as the app template.
// !! Note that the App is not a Vue instance.
var App = Vue.extend({})

// Create a router instance.
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter()

// Define some routes.
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
router.map({
    '/foo': {
        component: Foo
    },
    '/bar': {
        component: Bar
    }
})

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
router.start(App, '#app')
```

You can also checkout this example [live](http://jsfiddle.net/yyx990803/xyu276sa/).

In addition:

- The root Vue instance will be available as `router.app` once the initial render is complete.

- The router instance will be available in all descendants of the router app as `this.$router`.
