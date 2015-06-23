// NOTE: this example is based on 0.12.2 in which the
// `replace` option defaults to true.

var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

var router = new VueRouter({
  history: true
})

// define routes
router.map(require('./routes'))

// redirect
router.redirect({
  '/info': '/about',
  '/hello/:userId': '/user/:userId'
})

// global before
router.beforeEach(function (from, to) {
  if (to.path === '/forbidden') {
    alert('this route is forbidden by a global before hook')
    return false
  }
})

// global after
router.afterEach(function (from, to) {
  console.log('global after')
})

var App = Vue.extend({})

router.start(App, '#app')
