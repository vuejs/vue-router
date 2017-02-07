<template>
  <div>
    <h2 class="hello">Hello {{name}}</h2>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: 'Vue!'
    }
  }
}
</script>