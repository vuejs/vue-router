<template>
  <div>
    <h2 class="hello">Hello {{ name }}</h2>
    <p class="type">this.name is a: <b>{{ type }}<b></p>
  </div>
</template>

<script>

export default {
  computed: {
    name () {
      return this.$route.params.name || 'Vue!'
    },
    type () {
      return typeof this.name
    }
  }
}
</script>