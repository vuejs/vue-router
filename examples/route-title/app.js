import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div><h2>Home</h2></div>' }
const User = { template: '<div><h2>User</h2></div>' }
const About = { template: '<div><h2>About</h2></div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', title: 'home', component: Home },
    { path: '/user', title: 'user', component: User },
    { path: '/about/:id', title: 'about', name: 'about', component: About }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Active Links</h1>
      <h3>Look At The Title</h3>
      <ul>
        <li><router-link to="/">Link To /</router-link></li>
        <li><router-link to="/user">Link To /user</router-link></li>
        <li><router-link to="/about/1">Link To /about/1</router-link></li>
        <li><a @click="push('/')" >Push To /</a></li>
        <li><a @click="push({ path:'/user'})" >Push To /user With Location</a></li>
        <li><a @click="push({ path: '/about/1'})" >Push To /about/1 With Location</a></li>
        <li><a @click="replace('/')" >Replace To /</a></li>
        <li><a @click="replace('/user')" >Replace To /user</a></li>
        <li><a @click="replace({ name: 'about',params:{id:1}})" >Replace To /about With Location&Name&Params</a></li>
        <li><a @click="go(-1)">Go -1</a></li>
        <li><a @click="go(1)">Go 1</a></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `,
  methods: {
    push (location) {
      this.$router.push(location)
    },
    replace (location) {
      this.$router.replace(location)
    },
    go (n) {
      this.$router.go(n)
    }
  }
}).$mount('#app')
