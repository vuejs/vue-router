import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>This is Home</div>' }
const Foo = { template: '<div>This is Foo</div>' }
const Bar = { template: '<div>This is Bar</div>' }
const Parent = { template: '<div>This is Parent<br><router-view class="child-view">This is Parent</router-view></div>' }
const Child = { template: '<div>This is Child</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/foo', name: 'foo', component: Foo },
    { path: '/bar', name: 'bar', component: Bar },
    { path: '/parent', name: 'parent', component: Parent,
      children: [{ path: '', name: 'child', component: Child }]
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Named Routes</h1>
      <p>Current route name: {{ $route.name }}</p>
      <ul>
        <li><router-link :to="{ name: 'home' }">home</router-link></li>
        <li><router-link :to="{ name: 'foo' }">foo</router-link></li>
        <li><router-link :to="{ name: 'bar' }">bar</router-link></li>
        <li><router-link :to="{ name: 'parent' }">parent</router-link></li>
        <li><router-link :to="{ name: 'child' }">child</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
