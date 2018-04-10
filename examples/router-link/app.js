import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = { template: '<div><h2>{{ $route.fullPath }}</h2></div>' }
const Sub = { template: '<div><h2>Nested View</h2><router-view/></div>' }
const SubNested = { template: '<div><h2>Sub</h2><pre>{{ $route.params.id }}</pre></div>' }

const CustomLink = {
  props: ['disabled', 'n'],
  template: '<button :disabled="disabled">{{ n }} <slot/></button>'
}

Vue.component('CustomLink', CustomLink)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/other', component: Home },
    { path: '/sub/:id', component: Sub, children: [
      { path: 'nested1', component: SubNested, name: 'sub1' },
      { path: 'nested2', component: SubNested, name: 'sub2' }
    ]}
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Router Link lol</h1>
      <ul>
        <li><router-link to="/" class="custom-class" :class="{ otherClass: true }">/</router-link></li>
        <li><router-link is="CustomLink" disabled n="N" to="/other">CustomLink</router-link></li>
        <li><router-link to="/" style="color: crimson" :style="{ fontSize: '8px' }">/</router-link></li>
        <li><router-link to="/other">/other</router-link></li>
        <li><router-link to="/sub/1">/sub/1</router-link></li>
        <li><router-link to="/sub/2">/sub/2</router-link></li>
        <li><router-link :to="{ name: 'sub1' }">/sub/:id/nested1</router-link></li>
        <li><router-link :to="{ name: 'sub2' }">/sub/:id/nested2</router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
