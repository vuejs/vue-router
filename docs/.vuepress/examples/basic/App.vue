<template>
  <div>
    <h1>Basic</h1>
    <ul>
      <li><router-link to="/">/</router-link></li>
      <li><router-link to="/foo">/foo</router-link></li>
      <li><router-link to="/bar">/bar</router-link></li>
      <router-link tag="li" to="/bar" :event="['mousedown', 'touchstart']">
        <a>/bar</a>
      </router-link>
    </ul>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import Router from 'vue-router'
import Home from './Home'
import Foo from './Foo'
import Bar from './Bar'

// 3. Create the router
const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
export default {
  router,
}
</script>
