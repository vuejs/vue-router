import Vue from 'vue'
import Router from 'vue-router'

import Home from './Home'
import Foo from './Foo'
import Bar from './Bar'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

export default router
