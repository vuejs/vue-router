import Vue from 'vue'
import Router from 'vue-router'

import User from './User'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{ path: '/user/:id', component: User }]
})

export default router
