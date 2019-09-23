import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

/**
 * Signature of all route guards:
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 *
 * See http://router.vuejs.org/en/advanced/navigation-guards.html
 * for more details.
 */
function guardRoute (to, from, next) {
  if (window.confirm(`Navigate to ${to.path}?`)) {
    next()
  } else if (window.confirm(`Redirect to /baz?`)) {
    next('/baz')
  } else {
    next(false)
  }
}

// Baz implements an in-component beforeRouteLeave hook
const Baz = {
  data () {
    return { saved: false }
  },
  template: `
    <div>
      <p>baz ({{ saved ? 'saved' : 'not saved' }})</p>
      <button @click="saved = true">save</button>
    </div>
  `,
  beforeRouteLeave (to, from, next) {
    if (
      this.saved ||
      window.confirm('Not saved, are you sure you want to navigate away?')
    ) {
      next()
    } else {
      next(false)
    }
  }
}

// Qux implements an in-component beforeRouteEnter hook
const Qux = {
  data () {
    return {
      msg: null
    }
  },
  template: `<div>{{ msg }}</div>`,
  beforeRouteEnter (to, from, next) {
    // Note that enter hooks do not have access to `this`
    // because it is called before the component is even created.
    // However, we can provide a callback to `next` which will
    // receive the vm instance when the route has been confirmed.
    //
    // simulate an async data fetch.
    // this pattern is useful when you want to stay at current route
    // and only switch after the data has been fetched.
    setTimeout(() => {
      next(vm => {
        vm.msg = 'Qux'
      })
    }, 300)
  }
}

// Quux implements an in-component beforeRouteUpdate hook.
// this hook is called when the component is reused, but the route is updated.
// For example, when navigating from /quux/1 to /quux/2.
const Quux = {
  data () {
    return {
      prevId: 0
    }
  },
  template: `<div>id:{{ $route.params.id }} prevId:{{ prevId }}</div>`,
  beforeRouteUpdate (to, from, next) {
    this.prevId = from.params.id
    next()
  }
}

const NestedParent = {
  template: `
  <div id="nested-parent">
    Nested Parent
    <hr>
    <router-link to="/parent/child/1">/parent/child/1</router-link>
    <router-link to="/parent/child/2">/parent/child/2</router-link>
    <hr>
    <p id="bre-order">
      <span v-for="log in logs">{{ log }} </span>
    </p>
    <!-- #705 -->
    <!-- Some transitions, specifically out-in transitions, cause the view -->
    <!-- that is transitioning in to appear significantly later than normal, -->
    <!-- which can cause bugs as "vm" below in "next(vm => ...)" may not be -->
    <!-- available at the time the callback is called -->
    <transition name="fade" mode="out-in">
      <router-view :key="$route.path"/>
    </transition>
  </div>`,
  data: () => ({ logs: [] }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.logs.push('parent')
    })
  }
}

const GuardMixin = {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$parent.logs.push('mixin')
    })
  }
}

const NestedChild = {
  props: ['n'],
  template: `<div>Child {{ n }}</div>`,
  mixins: [GuardMixin],
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$parent.logs.push('child ' + vm.n)
    })
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },

    // inline guard
    { path: '/foo', component: Foo, beforeEnter: guardRoute },

    // using meta properties on the route config
    // and check them in a global before hook
    { path: '/bar', component: Bar, meta: { needGuard: true }},

    // Baz implements an in-component beforeRouteLeave hook
    { path: '/baz', component: Baz },

    // Qux implements an in-component beforeRouteEnter hook
    { path: '/qux', component: Qux },

    // in-component beforeRouteEnter hook for async components
    {
      path: '/qux-async',
      component: resolve => {
        setTimeout(() => {
          resolve(Qux)
        }, 0)
      }
    },

    // in-component beforeRouteUpdate hook
    { path: '/quux/:id', component: Quux },
    {
      path: '/parent',
      component: NestedParent,
      children: [
        { path: 'child/1', component: NestedChild, props: { n: 1 }},
        { path: 'child/2', component: NestedChild, props: { n: 2 }}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.needGuard)) {
    guardRoute(to, from, next)
  } else {
    next()
  }
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Navigation Guards</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
        <li><router-link to="/baz">/baz</router-link></li>
        <li><router-link to="/qux">/qux</router-link></li>
        <li><router-link to="/qux-async">/qux-async</router-link></li>
        <li><router-link to="/quux/1">/quux/1</router-link></li>
        <li><router-link to="/quux/2">/quux/2</router-link></li>
        <li><router-link to="/parent/child/2">/parent/child/2</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
