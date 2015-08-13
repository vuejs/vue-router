// warning: vue-router requires Vue 0.12.10+
var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

// create router
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
// 3 options:
// 1. return a boolean
// 2. return a Promise that resolves to a boolean
// 3. call transition.next() or transition.abort()
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

// boostrap the app
var App = Vue.extend(require('./app.vue'))
router.start(App, '#app')

// just for debugging
window.router = router
