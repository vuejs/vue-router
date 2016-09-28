import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import auth from './auth'
import App from './components/App.vue'
import About from './components/About.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/about', component: About },
    { path: '/dashboard', component: Dashboard, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, next) {
        auth.logout()
        next('/')
      }
    }
  ]
})

new Vue(Vue.util.extend({ router }, App)).$mount('#app')
