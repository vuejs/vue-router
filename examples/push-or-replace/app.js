import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home {{$route.query.time}}</div>' }
const Page = { template: '<div>page {{$route.query.time}}</div>' }
const Detail = { template: '<div>detail {{$route.query.time}}</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },

    { path: '/page', component: Page },

    { path: '/detail', component: Detail }

  ]
})

// User can check the replace type in navigation guard, and do anything they want.
router.beforeEach((to, from, next) => {
  if (to.replace) {
    to.query.replace = true
  } else {
    to.query.replace = false
  }

  if (to && to.query && !to.query.time) {
    to.query.time = new Date().getTime()
    next(to)
  } else {
    next()
  }
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Push Or Replace</h1>
      <p>User can check the replace type in navigation guard, and do anything they want.</p>
      <pre>
router.beforeEach((to, from, next) => {
  if (to.replace) {
    to.query.replace = true
  }
  else {
    to.query.replace = false
  }

  if (to && to.query && !to.query.time) {
    to.query.time = new Date().getTime()
    next(to)
  } else {
    next()
  }
})
      </pre>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/page">/page</router-link> ( push )</li>
        <li><a @click="$router.push('/page')">/page</a> $router.push('/page') </li>
        <li><router-link to="/detail" replace>/detail</router-link> ( replace )</li>
        <li><a @click="$router.replace('/detail')">/detail</a> $router.replace('/detail') </li>
        <li><a @click="$router.go(-1)">back</a> $router.go(-1) </li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
