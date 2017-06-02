import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }

// In Webpack we can use special require syntax to signify a "split point"
// Webpack will automatically split and lazy-load the split modules.
// - https://webpack.js.org/guides/code-splitting-require/

// Combine that with Vue's async components, we can easily make our route
// components lazy-loaded only when the given route is matched.

// async components are defined as:
// - resolve => resolve(Component)
// or
// - () => Promise<Component>

// For single component, we can simply use dynamic import which returns
// a Promise.
const Foo = () => import('./Foo.vue')

// The import() syntax is a replacement for the deprecated System.import() and
// is specified at https://github.com/tc39/proposal-dynamic-import. Webpack 2
// supports using it to indicate a code-splitting point.
// Note: if using Babel you will need `babel-plugin-syntax-dynamic-import`.

// If using Webpack 1, you will have to use AMD syntax or require.ensure:
// const Foo = resolve => require(['./Foo.vue'], resolve)

// If you want to group a number of components that belong to the same
// nested route in the same async chunk, you can use a special comment
// to indicate a chunk name for the imported module. (note this requires
// webpack 2.4.0+)
const Bar = () => import(/* webpackChunkName: "/bar" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "/bar" */ './Baz.vue')

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
