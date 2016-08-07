import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import auth from './auth'
import App from './components/App.vue'
import About from './components/About.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'

function requireAuth (route, redirect, next) {
  if (!auth.loggedIn()) {
    redirect({
      path: '/login',
      query: { redirect: route.fullPath }
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
      beforeEnter (route, redirect) {
        auth.logout()
        redirect('/')
      }
    }
  ]
})

new Vue(Vue.util.extend({ router }, App)).$mount('#app')
