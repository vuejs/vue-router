<template>
  <div>
    <h2>Named Routes</h2>
    <p>Current route name: {{ $route.name }}</p>
    <ul>
      <li>
        <router-link :to="{ name: 'home' }">home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'foo' }">foo</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'bar', params: { id: 123 }}">bar</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import router from './router'

export default {
  // to make it work in the preview only
  router,
}
</script>
