import Vue, { defineComponent, watch, ref } from 'vue'
import VueRouter from 'vue-router'
import { useRoute, useRouter } from 'vue-router/composables'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from '../../src/composables'

Vue.use(VueRouter)

const Foo = defineComponent({
  setup () {
    const route = useRoute()
    onBeforeRouteUpdate((to, from, next) => {
      console.log('Foo updating')
      next()
    })
    onBeforeRouteLeave((to, from, next) => {
      console.log('Foo leaving')
      next()
    })
    return { route }
  },
  template: `
<div>
  <h3>Foo</h3>
  {{ route.fullPath }}
</div>
  `
})

const Home = defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()

    // should be /
    const startRoute = route.fullPath

    onBeforeRouteUpdate((to, from, next) => {
      console.log('Home updating')
      next()
    })

    onBeforeRouteLeave((to, from, next) => {
      console.log('Home leaving')
      next()
    })

    const watchCount = ref(0)

    watch(() => route.query.n, () => {
      watchCount.value++
    })

    function navigate () {
      router.push({ query: { n: 1 + (Number(route.query.n) || 0) }})
    }
    return { route, navigate, watchCount, startRoute }
  },
  template: `
<div>
  <h2>Home</h2>
  <p id="start-route">{{ startRoute }}</p>
  <p id='watch-count'>{{ watchCount }}</p>
  <p id="fullpath">{{ route.fullPath }}</p>
  <button id="nav" @click="navigate">Navigate</button>
  <hr>
  <Foo />
</div>
  `,
  components: { Foo }
})

const About = defineComponent({
  setup () {
    const route = useRoute()
    return { route }
  },
  template: `
<div>
  <h2>About</h2>
  <p id="fullpath">{{ route.fullPath }}</p>
</div>
  `
})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/about">/foo</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
