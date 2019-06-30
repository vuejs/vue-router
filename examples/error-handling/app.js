import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Components
const Home = { template: '<div>Home</div>' }
const Default = { template: '<div>Default</div>' }
const Sync = { template: '<div>Sync</div>' }
const Async = { template: '<div>Async</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/default', component: Default, name: 'default' },
    { path: '/sync', component: Sync, name: 'sync' },
    { path: '/async', component: Async, name: 'async' }
  ]
})

router.onError((err) => {
  console.log('Router.onError:', err)
})

// Promise same as:
// router.beforeEach(async (to, from, next) => { throw new Error('Async error') })
router.beforeEach((to, from, next) => {
  if (to.name === 'async') {
    return new Promise((resolve, reject) => {
      reject(new Error('Async error'))
    })
  }

  next()
})

router.beforeEach((to, from, next) => {
  if (to.name === 'sync') {
    throw new Error('Sync error')
  }

  next()
})

new Vue({
  router,
  template: `
    <div id="app">
      <hr>
      <strong>Open console</strong>
      <br>
      <router-link to="/">/home</router-link>
      <router-link to="/default">/default</router-link>
      <router-link to="/sync">/sync</router-link>
      <router-link to="/async">/async</router-link>
      <br><br>
      <router-view></router-view>
    </div>
  `
}).$mount('#app')
