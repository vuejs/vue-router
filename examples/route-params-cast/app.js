import Vue from 'vue'
import VueRouter from 'vue-router'
import Hello from './Hello.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Hello }, // No params, no nothing
    { path: '/hello/:name', component: Hello }, // Cast to type Number
    { path: '/number/:name', component: Hello, params: { name: Number }}, // Cast to type Number
    { path: '/exclamation/:name', component: Hello, params: { name: value => `${value}!` }} // custom logic for casting params
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Route props</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/hello/you">/hello/you</router-link></li>
        <li><router-link to="/number/3">/number/3</router-link></li>
        <li><router-link to="/exclamation/1">/exclamation/1</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
