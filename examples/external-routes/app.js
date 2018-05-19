import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: 'https://example.com', name: 'example' },
    { path: 'https://example.com/user/:username', children: [
      { path: '/', name: 'example.user' },
      { path: 'settings', name: 'example.user.settings' }
    ] }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>External Routes</h1>
      <ul>
        <li><router-link :to="{ name: 'example' }">https://example.com</router-link></li>
        <router-link tag="li" :to="{ name: 'example' }">
          <a>https://example.com</a>
        </router-link>
        <li><router-link :to="{ name: 'example.user', params: { username: 'evan' }}">https://example.com/user/evan</router-link></li>
        <li><router-link :to="{ name: 'example.user.settings', params: { username: 'evan' }}">https://example.com/user/evan/settings</router-link></li>
        <li><router-link :to="{ name: 'example', query: { foo: 'bar' }}">https://example.com/?foo=bar</router-link></li>
        <li><router-link :to="{ name: 'example', hash: '#foo' }">https://example.com/#foo</router-link></li>
      </ul>
    </div>
  `
}).$mount('#app')
