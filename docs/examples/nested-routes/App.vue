<template>
  <div>
    <p>
      <router-link to="/user/john">/user/john</router-link>
      <router-link to="/user/alice">/user/alice</router-link>
    </p>
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
