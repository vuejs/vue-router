<template>
  <div>
    <div v-if="loading">Loading data...</div>
    <div v-if="!loading">message! {{id}} {{route.params.messageId}}</div>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      id: null
    }
  }
}
</script>
