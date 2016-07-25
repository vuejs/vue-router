import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// scrollBehavior:
// - only available in html5 history mode
// - defaults to false
// - if set to true, remembers and restores scroll position on popstate
// - or use a function to conditionally return a position
const scrollBehavior = (to, from, isPopState) => {
  if (!isPopState || to.matched.some(m => m.meta.scrollToTop)) {
    // explicitly control scroll behavior
    // scroll to top on new navigations or routes that requires scrolling to top
    return { x: 0, y: 0 }
  }
  // for popstate navigations, use saved position
  return true
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  scrollBehavior,
  routes: [
    { path: '/', component: Home, meta: { scrollToTop: true } },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

const app = new Vue({
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
