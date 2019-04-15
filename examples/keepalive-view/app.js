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

const WithGuard = {
  template: '<div>{{ $route.name }}: {{ n }}</div>',
  data: () => ({ n: 0 }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.n++
    })
  }
}

const IndexChild1 = { template: '<div>index child1</div>' }
const IndexChild2 = { template: '<div>index child2</div>' }

const Home = { template: '<div>home</div>' }

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
    },
    {
      path: '/with-guard1',
      name: 'with-guard1',
      component: WithGuard
    },
    {
      path: '/with-guard2',
      name: 'with-guard2',
      component: WithGuard
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <ul>
        <li><router-link to="/index/child1">/index/child1</router-link></li>
        <li><router-link to="/index/child2">/index/child2</router-link></li>
        <li><router-link to="/home">/home</router-link></li>
        <li><router-link to="/with-guard1">/with-guard1</router-link></li>
        <li><router-link to="/with-guard2">/with-guard2</router-link></li>
      </ul>
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </div>
  `
}).$mount('#app')
