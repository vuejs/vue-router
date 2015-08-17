// warning: vue-router requires Vue 0.12.10+
import Vue from 'vue'
import VueRouter from '../../src'
import { configRouter } from './route-config'
require('es6-promise').polyfill()

// install router
Vue.use(VueRouter)

// create router
const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// configure router
configRouter(router)

// boostrap the app
const App = Vue.extend(require('./app.vue'))
router.start(App, '#app')

// just for debugging
window.router = router
