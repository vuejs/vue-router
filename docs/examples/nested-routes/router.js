import Vue from 'vue'
import Router from 'vue-router'

import User from './User'
import UserHome from './UserHome'
import UserProfile from './UserProfile'
import UserPosts from './UserPosts'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        { path: '', component: UserHome },
        { path: 'profile', component: UserProfile },
        { path: 'posts', component: UserPosts }
      ]
    }
  ]
})

export default router
