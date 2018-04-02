import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let count = 0

const Home = {
  template: `
    <div>
      <span>nav param:</span>
      <span class="count" v-text="$route.params.count"></span>
      <br>
      <button @click="update()">change param</button>

      <br>
      <br>
      <div class="area">
        <router-link :to="{ name: 'app' }">
            router-link in Home
        </router-link>

        <br>

        <nested-component></nested-component>
      </div>
    </div>
  `,
  methods: {
    update () {
      count++
      this.$router.push({
        params: {
          count: count
        }
      })
    }
  }
}

Vue.component('nested-component', {
  template: `
    <router-link :to="{ name: 'app' }">
      router-link in NestedComponent
    </router-link>
  `
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/nameed-change/:count',
      name: 'app',
      component: Home
    },
    {
      path: '*',
      redirect: { name: 'app', params: { count: 0 }}
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <router-view></router-view>
    </div>
  `
}).$mount('#app')

