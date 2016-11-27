<template>
  <div>
    <h2 class="calculator_add">{{a}} + {{b}} = {{ a + b }}</h2>
    <h2 class="calculator_multiply">{{a}} * {{b}} = {{ a * b }}</h2>
  </div>
</template>

<script>

export default {
  props: {
    a: {
      type: Number,
      required: true
    },
    b: {
      type: Number,
      required: true
    }
  }
}
</script>