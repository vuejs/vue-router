import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/foo', component: Foo }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Add and Remove Routes</h1>
      <ul>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
      </ul>
      <button id="add-btn" @click="addRouteBar">Add Route Bar</button>
      <button id="remove-btn" @click="removeRouteBar">Remove Route Bar</button>
      <router-view class="view"></router-view>
    </div>
  `,
  methods: {
    addRouteBar () {
      this.$router.addRoutes([{ path: '/bar', component: Bar }])
    },
    removeRouteBar () {
      this.$router.updateRoutes([{ path: '/bar' }])
    }
  }
}).$mount('#app')
