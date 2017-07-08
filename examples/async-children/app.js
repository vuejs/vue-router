import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/', component: Home },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  {
    path: '/basic',
    component: { template: '<div><router-view class="async-view"></router-view></div>' },
    loadChildren: () => import('./basic-async').then(asyncConfig => asyncConfig.routes)
  },
  {
    path: '/deep',
    component: { template: '<div><router-view class="async-view"></router-view></div>' },
    loadChildren: () => import('./deep-async-a').then(asyncConfig => asyncConfig.routes)
  },
  {
    path: '/default-deep',
    component: { template: '<div><router-view class="async-view"></router-view></div>' },
    loadChildren: () => import('./deep-async-default-a').then(asyncConfig => asyncConfig.routes)
  }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
        <li><router-link to="/basic">/basic</router-link></li>
        <li><router-link to="/basic/foo">/basic/foo</router-link></li>
        <li><router-link to="/basic/bar">/basic/bar</router-link></li>
        <li><router-link to="/deep/a/b">/deep/a/b</router-link></li>
        <li><router-link to="/default-deep">/default-deep</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
