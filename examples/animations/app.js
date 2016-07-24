import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = {
  template: `
    <div>
      <h2>Home</h2>
      <p>hello</p>
    </div>
  `
}

const Parent = {
  template: `
    <div class="parent">
      <h2>Parent</h2>
      <transition name="slide">
        <router-view class="child"></router-view>
      </transition>
    </div>
  `
}

const Default = { template: '<div>default</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/parent', component: Parent, children: [
      { path: '', component: Default },
      { path: 'foo', component: Foo },
      { path: 'bar', component: Bar }
    ]}
  ]
})

const app = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Animations</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/parent">/parent</router-link></li>
        <li><router-link to="/parent/foo">/parent/foo</router-link></li>
        <li><router-link to="/parent/bar">/parent/bar</router-link></li>
      </ul>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  `
}).$mount('#app')
