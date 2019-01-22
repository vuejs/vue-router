import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Wrap = { template: '<div>child: <router-view></router-view></div>' }

const Index = {
  template: '<wrap />',
  components: {
    Wrap
  }
}

const IndexChild1 = { template: '<div class="current">index child1</div>' }
const IndexChild2 = { template: '<div class="current">index child2</div>' }

const Home = { template: '<div class="current">home</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/index',
      component: Index,
      children: [
        {
          path: 'child1',
          component: IndexChild1
        },
        {
          path: 'child2',
          component: IndexChild2
        }
      ]
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <ul>
        <li><router-link tag="a" to="/index/child1">index child 1</router-link></li>
        <li><router-link tag="a" to="/index/child2">index child 2</router-link></li>
        <li><router-link tag="a" to="/home">home</router-link></li>
      </ul>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  `
}).$mount('#app')
