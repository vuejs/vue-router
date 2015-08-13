// warning: vue-router requires Vue 0.12.10+
var Vue = require('vue')
var VueRouter = require('../src')

// install router
Vue.use(VueRouter)

// create router
var router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// configure router
require('./route-config')(router)

// boostrap the app
var App = Vue.extend(require('./app.vue'))
router.start(App, '#app')

// just for debugging
window.router = router
