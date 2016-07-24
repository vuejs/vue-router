import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div><h1>Home</h1><router-view></router-view></div>' }
const Default = { template: '<div>default</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Baz = { template: '<div>baz</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home, children: [
      { path: '', component: Default },
      { path: 'foo', component: Foo },
      { path: 'bar', component: Bar },
      { path: 'baz', name: 'baz', component: Baz },
      // relative redirect to a sibling route
      { path: 'relative-redirect', redirect: 'foo' },
    ]},
    // absolute redirect
    { path: '/absolute-redirect', redirect: '/bar' },
    // named redirect
    { path: '/named-redirect', redirect: { name: 'baz' }},
    // catch all redirect
    { path: '*', redirect: '/' }
  ]
})

const app = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Named Routes</h1>
      <ul>
        <li><router-link to="/relative-redirect">/relative-redirect (redirects to /foo)</router-link></li>
        <li><router-link to="/absolute-redirect">/absolute-redirect (redirects to /bar)</router-link></li>
        <li><router-link to="/named-redirect">/named-redirect (redirects to /baz)</router-link></li>
        <li><router-link to="/not-found">/not-found (redirects to /)</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
