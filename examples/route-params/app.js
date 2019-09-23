import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Log = {
  template: `<div class="log">id: {{ $route.params.id }}, type: {{ $route.params.type }}</div>`
}

const Logs = {
  template: `
    <div>
      <pre id="params">{{ to.params }}</pre>
      <router-link :to="to" class="child-link">{{ to.params.type }}</router-link>
      <router-view></router-view>
    </div>
  `,
  data () {
    return {
      to: {
        name: 'items.logs.type',
        params: { type: 'info' }
      }
    }
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/items/:id/logs',
      component: Logs,
      children: [
        {
          path: ':type',
          name: 'items.logs.type',
          component: Log
        }
      ]
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Route params</h1>
      <ul>
        <li><router-link to="/items/1/logs">item #1</router-link></li>
        <li><router-link to="/items/2/logs">item #2</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
