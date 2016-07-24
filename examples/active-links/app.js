import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }

const Users = {
  template: `
    <div>
      <h2>Users</h2>
      <router-view></router-view>
    </div>
  `
}

const User = { template: '<div>{{ $route.params.username }}</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/users', component: Users, children: [
      { path: ':username', component: User }
    ]},
  ]
})

const app = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Active Links</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/" exact>/ (exact match)</router-link></li>

        <li><router-link to="/users">/users</router-link></li>
        <li><router-link to="/users" exact>/users (exact match)</router-link></li>

        <li><router-link to="/users/evan">/users/evan</router-link></li>
        <li><router-link to="/users/evan#foo">/users/evan#foo</router-link></li>
        <li>
          <router-link :to="{ path: '/users/evan', query: { foo: 'bar' }}">
            /users/evan?foo=bar
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/users/evan', query: { foo: 'bar', baz: 'qux' }}">
            /users/evan?foo=bar&baz=qux
          </router-link>
        </li>

        <li><router-link to="/about">/about</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
