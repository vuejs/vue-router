import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }

// define Foo & Bar as async components

// signature for async components: resolve => resolve(Component)
// In Webpack we can use the AMD require syntax to "split" the bundle
// Webpack will automatically split and lazy-load the split modules.
// https://webpack.github.io/docs/code-splitting.html

const Foo = resolve => require(['./Foo.vue'], m => resolve(m.default))
const Bar = resolve => require(['./Bar.vue'], m => resolve(m.default))

// NOTE if using Webpack 2, you should do:
// const Foo = resolve => {
//  System.import('./Foo.vue').then(m => resolve(m.default)
// })

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    // Just use them normally in the route config
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
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
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
