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
const Unicode = { template: '<div>unicode: {{ $route.params.unicode }}</div>' }

// 3. Create the router
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    { path: '/', component: Home }, // all paths are defined without the hash.
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '/é', component: Unicode },
    { path: '/é/:unicode', component: Unicode }
  ]
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
const vueInstance = new Vue({
  router,
  template: `
    <div id="app">
      <h1>Mode: 'hash'</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
        <router-link tag="li" to="/bar">/bar</router-link>
        <li><router-link to="/é">/é</router-link></li>
        <li><router-link to="/é/ñ">/é/ñ</router-link></li>
        <li><router-link to="/é/ñ?t=%25ñ">/é/ñ?t=%ñ</router-link></li>
        <li><router-link to="/é/ñ#é">/é/ñ#é</router-link></li>
      </ul>
      <pre id="query-t">{{ $route.query.t }}</pre>
      <pre id="hash">{{ $route.hash }}</pre>
      <router-view class="view"></router-view>
    </div>
  `,
  methods: {
  }
}).$mount('#app')

document.getElementById('unmount').addEventListener('click', () => {
  vueInstance.$destroy()
  vueInstance.$el.innerHTML = ''
})
