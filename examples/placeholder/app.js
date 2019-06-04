import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div id="home">This is Home</div>' }
const Header = { template: '<div id="header">This is Header</div>' }
const Footer = { template: '<div id="footer">This is Footer</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      components: {
        header: Header,
        default: Home,
        footer: Footer
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>router-view placeholder</h1>
      <router-view name="header">
        <div id="header-loading">Loading header...</div>
      </router-view>
      <router-view>
        <div id="default-loading">Loading default...</div>
      </router-view>
      <router-view name="footer"></router-view>
    </div>
  `
}).$mount('#app')
