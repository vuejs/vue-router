import Vue from 'vue'
import VueRouter from 'vue-router'

// track number of popstate listeners
let numPopstateListeners = 0
const listenerCountDiv = document.createElement('div')
listenerCountDiv.id = 'popstate-count'
listenerCountDiv.textContent = numPopstateListeners + ' popstate listeners'
document.body.appendChild(listenerCountDiv)

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener
window.addEventListener = function (name, handler) {
  if (name === 'popstate') {
    listenerCountDiv.textContent =
      ++numPopstateListeners + ' popstate listeners'
  }
  return originalAddEventListener.apply(this, arguments)
}
window.removeEventListener = function (name, handler) {
  if (name === 'popstate') {
    listenerCountDiv.textContent =
      --numPopstateListeners + ' popstate listeners'
  }
  return originalRemoveEventListener.apply(this, arguments)
}

// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

// 2. Define route components
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Unicode = { template: '<div>unicode</div>' }
const Query = { template: '<div>query: "{{ $route.params.q }}"</div>' }

// 3. Create the router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: encodeURI('/é'), component: Unicode },
    { path: '/query/:q', component: Query }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.query.delay) {
    setTimeout(() => {
      next()
    }, Number(to.query.delay))
  } else {
    next()
  }
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
const vueInstance = new Vue({
  router,
  data: () => ({ n: 0 }),
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
        <router-link tag="li" to="/bar" :event="['mousedown', 'touchstart']">
          <a>/bar</a>
        </router-link>
        <li><router-link :to="encodeURI('/é')">/é</router-link></li>
        <li><router-link :to="encodeURI('/é?t=%ñ')">/é?t=%ñ</router-link></li>
        <li><router-link :to="encodeURI('/é#%ñ')">/é#%25ñ</router-link></li>
        <router-link to="/foo" v-slot="props" custom>
          <li :class="[props.isActive && 'active', props.isExactActive && 'exact-active']">
            <a :href="props.href" @click="props.navigate">{{ props.route.path }} (with v-slot).</a>
          </li>
        </router-link>
        <li><router-link to="/foo" replace>/foo (replace)</router-link></li>
        <li><router-link to="/query/A%25">/query/A%</router-link></li>
        <li><router-link to="/?delay=200">/ (delay of 500ms)</router-link></li>
        <li><router-link to="/foo?delay=200">/foo (delay of 500ms)</router-link></li>
      </ul>
      <button id="navigate-btn" @click="navigateAndIncrement">On Success</button>
      <pre id="counter">{{ n }}</pre>
      <pre id="query-t">{{ $route.query.t }}</pre>
      <pre id="hash">{{ $route.hash }}</pre>
      <router-view class="view"></router-view>
    </div>
  `,

  methods: {
    navigateAndIncrement () {
      const increment = () => this.n++
      if (this.$route.path === '/') {
        this.$router.push('/foo', increment)
      } else {
        this.$router.push('/', increment)
      }
    }
  }
}).$mount('#app')

document.getElementById('unmount').addEventListener('click', () => {
  vueInstance.$destroy()
  vueInstance.$el.innerHTML = ''
})
