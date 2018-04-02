import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components
const Home = { template: '<div>Component: home</div>' }
const Foo = { template: '<div>Component: foo</div>' }
const Bar = { template: '<div>Component: bar</div>' }

// 3. Create the router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

// 4. Create extended base Vue with router injected here (all
// children should inherit the same router).
const BaseVue = Vue.extend({ router })

// Discrete components means that a new Vue instance will be created
// and bound on multiple *independent* nodes (eg. one Vue instance
// per node); but the router should act as a singleton and keep all
// instances in sync.
Array.prototype.forEach.call(document.querySelectorAll('.app'), (node) => {
  new BaseVue({
    el: node
  })
})
