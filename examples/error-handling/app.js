import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// eslint-disable-next-line no-unused-vars
let asyncMode = true

const makeError = (msg) => {
  if (asyncMode) {
    return new Promise((resolve, reject) => {
      reject(new Error(msg))
    })
  }

  throw new Error(msg)
}

// Components
const Home = { template: '<div>Home</div>' }
const BeforeEach = { template: '<div>BeforeEach</div>' }
const AfterEach = { template: '<div>AfterEach</div>' }
const BeforeEnter = {
  template: '<div>BeforeRouteEnter</div>',
  beforeRouteEnter () {
    return makeError('component.BeforeRouteEnter')
  }
}
const BeforeUpdate = {
  template: '<div>BeforeRouteUpdate</div>',
  beforeRouteUpdate () {
    return makeError('component.BeforeRouteUpdate')
  },
  mounted () {
    const currentId = +this.$route.params.id || 1
    console.log(`change params.id from ${currentId} to ${currentId + 1}`)
    this.$router.push({
      name: 'component.beforeRouteUpdate',
      params: { id: currentId + 1 }
    })
  }
}
const BeforeLeave = {
  template: '<div>BeforeRouteLeave</div>',
  data () {
    return {
      canLeave: false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (from.name === 'component.beforeRouteLeave' && !this.canLeave) {
      this.canLeave = true
      console.log('click twice to leave route')
      return makeError('component.beforeRouteLeave')
    }

    next()
  }
}

const router = new VueRouter({
  base: __dirname,
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/before-enter', component: BeforeEnter, name: 'component.beforeRouteEnter' },
    { path: '/before-update/:id', component: BeforeUpdate, name: 'component.beforeRouteUpdate' },
    { path: '/before-leave', component: BeforeLeave, name: 'component.beforeRouteLeave' },
    { path: '/before-each', component: BeforeEach, name: 'router.beforeEach' },
    { path: '/after-each', component: AfterEach, name: 'router.afterEach' }
  ]
})

router.onError((err) => {
  console.log(
    '%c Router.onError - ' + (asyncMode ? 'async' : 'sync'),
    'background: #fff; color: #000',
    err.message
  )
})

router.afterEach(() => {
  return makeError('router.afterEach')
})

// Promise same as:
// router.beforeEach(async (to, from, next) => { throw new Error('Async error') })
router.beforeEach((to, from, next) => {
  if (to.name === 'router.beforeEach') {
    return makeError('router.beforeEach')
  }

  next()
})

new Vue({
  router,
  data () {
    return {
      asyncMode
    }
  },
  watch: {
    asyncMode (val) {
      asyncMode = val
    }
  },
  template: `
    <div id="app">
      <h1>Error Handling</h1>
      <strong @click="asyncMode = !asyncMode" style="cursor: pointer">
        Open console - <code>{{ asyncMode ? 'async' : 'sync' }} (click)</code>
      </strong>
      <br>
      <ul>
        <li><router-link to="/">/home</router-link></li>
        <li><router-link to="/before-each">/beforeEach</router-link></li>
        <li><router-link to="/after-each">/afterEach</router-link></li>
        <li><router-link to="/before-enter">/beforeRouteEnter</router-link></li>
        <li><router-link to="/before-update/1">/beforeRouteUpdate</router-link></li>
        <li><router-link to="/before-leave">/beforeRouteLeave</router-link></li>
      </ul>
      <br>
      <router-view></router-view>
    </div>
  `
}).$mount('#app')
