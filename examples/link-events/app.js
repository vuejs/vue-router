import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

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

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
new Vue({
  router,
  data () {
    return {
      backgroundColor: null,
      bodyText: null
    }
  },
  methods: {
    mouseDown () {
      window.alert('Mouse button pressed')
    },
    say (msg) {
      window.alert(msg)
    },
    toggleBgOnClick () {
      if (this.backgroundColor) {
        this.backgroundColor = null
      } else {
        this.backgroundColor = 'green'
      }
    }
  },
  computed: {
    customBackground () {
      return {
        backgroundColor: this.backgroundColor
      }
    }
  },
  template: `
    <div id="app">
      <h1>Link Events Handler examples</h1>
      <ul>
        <li><router-link to="/" @mouseup="say('Visit me once in a while!')">/home</router-link></li>
        <li><router-link to="/foo" @click="say('This got clicked')">/foo</router-link></li>
        <li><router-link to="/bar" @click="toggleBgOnClick" :style="customBackground">/bar</router-link></li>
        <router-link tag="li" to="/bar" :event="['mousedown', 'touchstart']" @mousedown="mouseDown">
          <a>/bar</a>
        </router-link>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
