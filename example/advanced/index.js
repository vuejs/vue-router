// warning: vue-router requires Vue 0.12.10+
import Vue from 'vue'
import AppRouter from './app-router'
require('es6-promise').polyfill()

// install router
Vue.use(AppRouter)

// create router
const router = new AppRouter({
  history: true,
  saveScrollPosition: true
})

// configure router
//configRouter(router)

// boostrap the app
const App = Vue.extend(require('./app.vue'))
router.start(App, '#app')

// just for debugging
window.router = router
