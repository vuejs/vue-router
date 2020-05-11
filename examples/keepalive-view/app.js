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

const ViewWithKeepalive = {
  template: '<keep-alive><router-view></router-view></keep-alive>'
}

const Parent = { template: '<div>msg: {{ msg }}<router-view /></div>', props: ['msg'] }

const RequiredProps = {
  template: '<div>props from route config is: {{ msg }}</div>',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
}

// keep original values to restore them later
const originalSilent = Vue.config.silent
const originalWarnHandler = Vue.config.warnHandler

const CatchWarn = {
  template: `<div>{{ didWarn ? 'caught missing prop warn' : 'no missing prop warn' }}</div>`,
  data () {
    return {
      didWarn: false
    }
  },
  beforeRouteEnter (to, from, next) {
    let missPropWarn = false
    Vue.config.silent = false
    Vue.config.warnHandler = function (msg, vm, trace) {
      if (/Missing required prop/i.test(msg)) {
        missPropWarn = true
      }
    }
    next(vm => {
      vm.didWarn = missPropWarn
    })
  },
  beforeRouteLeave (to, from, next) {
    // restore vue config
    Vue.config.silent = originalSilent
    Vue.config.warnHandler = originalWarnHandler
    next()
  }
}

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
    },
    {
      path: '/one',
      component: ViewWithKeepalive,
      children: [
        {
          path: 'two',
          component: ViewWithKeepalive,
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
        }
      ]
    },
    {
      path: '/config-required-props',
      component: Parent,
      props: { msg: 'from parent' },
      children: [
        {
          path: 'child',
          component: RequiredProps,
          props: {
            msg: 'from child'
          }
        }
      ]
    },
    {
      path: '/catch-warn',
      component: CatchWarn
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
        <li><router-link to="/one/two/child1">/one/two/child1</router-link></li>
        <li><router-link to="/one/two/child2">/one/two/child2</router-link></li>
        <li><router-link to="/config-required-props">/config-required-props</router-link></li>
        <li><router-link to="/config-required-props/child">/config-required-props/child</router-link></li>
        <li><router-link to="/catch-warn">/catch-warn</router-link></li>
      </ul>
      <keep-alive>
        <router-view class="view"></router-view>
      </keep-alive>
    </div>
  `
}).$mount('#app')
