<template>
  <div>
    <ul>
      <li>
        <router-link to="/user/foo">/user/foo</router-link>
      </li>
      <li>
        <router-link to="/user/bar">/user/bar</router-link>
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
