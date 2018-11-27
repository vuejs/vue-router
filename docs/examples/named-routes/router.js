import Vue from 'vue'
import Router from 'vue-router'

import Home from './Home'
import Foo from './Foo'
import Bar from './Bar'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/foo', name: 'foo', component: Foo },
    { path: '/bar/:id', name: 'bar', component: Bar }
  ]
})

export default router
