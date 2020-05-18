import Vue from 'vue'
import VueRouter from 'vue-router'

// track number of popstate listeners
let numPopstateListeners = 0
const listenerCountDiv = document.getElementById('popcount')
listenerCountDiv.textContent = 0

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener
window.addEventListener = function (name, handler) {
  if (name === 'popstate') {
    listenerCountDiv.textContent =
      ++numPopstateListeners
  }
  return originalAddEventListener.apply(this, arguments)
}
window.removeEventListener = function (name, handler) {
  if (name === 'popstate') {
    listenerCountDiv.textContent =
      --numPopstateListeners
  }
  return originalRemoveEventListener.apply(this, arguments)
}

// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects $router and $route to all router-enabled child components
Vue.use(VueRouter)

const looper = [1, 2, 3]

looper.forEach((n) => {
  let vueInstance
  const mountEl = document.getElementById('mount' + n)
  const unmountEl = document.getElementById('unmount' + n)

  mountEl.addEventListener('click', () => {
    // 2. Define route components
    const Home = { template: '<div>home</div>' }
    const Foo = { template: '<div>foo</div>' }

    // 3. Create the router
    const router = new VueRouter({
      mode: 'history',
      base: __dirname,
      routes: [
        { path: '/', component: Home },
        { path: '/foo', component: Foo }
      ]
    })

    // 4. Create and mount root instance.
    // Make sure to inject the router.
    // Route components will be rendered inside <router-view>.
    vueInstance = new Vue({
      router,
      template: `
        <div id="app-${n}">
          <h1>Basic</h1>
          <ul>
            <li><router-link to="/">/</router-link></li>
            <li><router-link to="/foo">/foo</router-link></li>
          </ul>
          <router-view class="view"></router-view>
        </div>
      `
    }).$mount('#app-' + n)
  })

  unmountEl.addEventListener('click', () => {
    vueInstance.$destroy()
    vueInstance.$el.innerHTML = ''
  })
})
