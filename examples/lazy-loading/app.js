import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }

// In Webpack we can use special require syntax to signify a "split point"
// Webpack will automatically split and lazy-load the split modules.
// - https://webpack.github.io/docs/code-splitting.html

// Combine that with Vue's async components, we can easily make our route
// components lazy-loaded only when the given route is matched.

// async components are defined as:
// - resolve => resolve(Component)
// or
// - () => Promise<Component>

// For single component, we can use the AMD shorthand
// require(['dep'], dep => { ... })
const Foo = resolve => require(['./Foo.vue'], resolve)

// If using Webpack 2, you can also do:
// const Foo = () => System.import('./Foo.vue')

// If you want to group a number of components that belong to the same
// nested route in the same async chunk, the syntax is a bit more verbose.
// The repetition of the ensured list is necessary because the dependencies
// must be statically analyzable by Webpack. (Please let me know if you
// have a better way of handling this!)
const Bar = resolve => require.ensure(['./Bar.vue', './Baz.vue'], () => {
  resolve(require('./Bar.vue'))
})

const Baz = resolve => require.ensure(['./Bar.vue', './Baz.vue'], () => {
  resolve(require('./Baz.vue'))
})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    // Just use them normally in the route config
    { path: '/foo', component: Foo },
    // Bar and Baz belong to the same root route
    // and grouped in the same async chunk.
    { path: '/bar', component: Bar,
      children: [
        { path: 'baz', component: Baz }
      ]
    }
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
        <li><router-link to="/bar/baz">/bar/baz</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
