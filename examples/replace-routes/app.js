import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const RouteX = { template: '<div>Route X</div>' }
const RouteY = { template: '<div>Route Y</div>' }
const RouteZ = { template: '<div>Route Z</div>' }

const Route1 = { template: '<div>Route 1</div>' }
const Route2 = { template: '<div>Route 2</div>' }

const Route3 = { template: '<div>Route 3</div>' }
const Route4 = { template: '<div>Route 4</div>' }

const routes1 = [
  { path: '/common1', name: 'common1', component: RouteX },
  { path: '/common2', name: 'common2', component: RouteZ },
  { path: '/route-1', name: 'route1', component: Route1 },
  { path: '/route-2', name: 'route2', component: Route2 }
]

const routes2 = [
  { path: '/common1', name: 'common1', component: RouteY },
  { path: '/common2', name: 'common2', component: RouteZ },
  { path: '/route-3', name: 'route3', component: Route3 },
  { path: '/route-4', name: 'route4', component: Route4 }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: []
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Replace Routes</h1>

      <div style="display: inline-block;">
        <ul class="set1">
          <li><router-link to="/common1">
            /common1 (X)
          </router-link></li>
          <li><router-link to="/common2">
            /common2 (Z)
          </router-link></li>
          <li><router-link to="/route-1">
            /route-1
          </router-link></li>
          <li><router-link :to="{ name: 'route2' }">
            /route-2 (named)
          </router-link></li>
        </ul>
        <button @click="loadRoutes1" class="btn1">Load routes set 1</button>
      </div>
      <div style="display: inline-block;">
        <ul  class="set2">
          <li><router-link to="/common1">
            /common1 (Y)
          </router-link></li>
          <li><router-link to="/common2">
            /common2 (Z)
          </router-link></li>
          <li><router-link to="/route-3">
            /route-3
          </router-link></li>
          <li><router-link :to="{ name: 'route4' }">
            /route-4 (named)
          </router-link></li>
        </ul>
        <button @click="loadRoutes2" class="btn2">Load route set 2</button>
      </div>
      <button @click="removeAllRoutes" class="btn3">Remove all routes</button>
      <br/>
      <br/>
      Current route set: <span class="route-set">{{ routeSet }}</span>
      <br/>
      Current route content:
      <div class="view"><router-view :style="{ display: 'inline-block' }"></router-view></div>

    </div>
  `,
  data () {
    return { routeSet: null }
  },
  methods: {
    loadRoutes1 () {
      router.replaceRoutes(routes1)
      this.routeSet = 'set1'
    },
    loadRoutes2 () {
      router.replaceRoutes(routes2)
      this.routeSet = 'set2'
    },
    removeAllRoutes () {
      router.replaceRoutes([])
      this.routeSet = null
    }
  }
}).$mount('#app')
