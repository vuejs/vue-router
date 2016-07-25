import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'
import Post from './Post.vue'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/post/:id', component: Post }
  ]
})

const app = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Data Fetching</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/post/1">/post/1</router-link></li>
        <li><router-link to="/post/2">/post/2</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
