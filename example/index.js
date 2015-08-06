// NOTE: this example is based on 0.12.2 in which the
// `replace` option defaults to true.

var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

var router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// define routes
router.map(require('./routes'))

// redirect
router.redirect({
  '/info': '/about',
  '/hello/:userId': '/user/:userId'
})

// global before
// you can perform async rejection here
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    router.app.authenticating = true
    setTimeout(function () {
      router.app.authenticating = false
      alert('this route is forbidden by a global before hook')
      transition.abort()
    }, 500)
  } else {
    transition.next()
  }
})

var App = Vue.extend({
  data: function () {
    return {
      authenticating: false
    }
  }
})

router.start(App, '#app')

// just for debugging
window.router = router
