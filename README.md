# Work in Progress - Use at your own risk!

Note: `vue-router` only supports Vue 0.12+.

### Basic Example

``` js
var Vue = require('vue')
var Router = require('vue-router')

Vue.use(Router)

var App = Vue.extend({
  template:
    '<h1>App</h1>' +
    '<router-view></router-view>', // <-- outlet
  components: {
    'view-a': {
      template:
        '<h2>View A</h2>' +
        '<router-view></router-view>', // <-- nested outlet
      components: {
        subComponent: { /* ... */ }
      }
    },
    'view-b': { /* ... */ }
  }
})

var router = new Router()

router.map({
  '/route-a': {
    component: 'view-a', // <-- rendered to outlet when '/route-a'
                         //     is matched.
    subRoutes: {
      '/sub-route': {
        component: 'subComponent' // <-- rendered into nested outlet
                                  //     when '/route-a/sub-route' is
                                  //     matched.
      }
    }
  },
  '/route-b': {
    component: 'view-b'
  }
})

router.start(App, '#app')
```
