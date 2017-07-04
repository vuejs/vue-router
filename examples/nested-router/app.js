import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = { template: `<div class="foo"><h1>foo</h1></div>` }
const Bar = { template: `<div class="bar"><h1>bar</h1></div>` }

const childRouter = new VueRouter({
  mode: 'abstract',
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

const Nested = {
  router: childRouter,
  template: `<div class="child">
    <p>Child router path: {{ $route.fullPath }}</p>
    <ul>
      <li><router-link to="/foo">/foo</router-link></li>
      <li><router-link to="/bar">/bar</router-link></li>
    </ul>
    <router-view/>
  </div>`
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/nested-router', component: Nested },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <p>Root router path: {{ $route.fullPath }}</p>
      <ul>
        <li><router-link to="/nested-router">/nested-router</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
  `
}).$mount('#app')
