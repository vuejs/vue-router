<template>
  <div v-if="list && list.length">
    <h3>{{ name }} Sponsors</h3>

    <a
      v-for="sponsor in list"
      :key="sponsor.href"
      :href="sponsor.href"
      target="_blank"
      rel="sponsored noopener"
      :style="{ width: size + 'px' }"
    >
      <img :src="sponsor.imgSrcLight" :style="{ width: size + 'px' }" />
    </a>
    <br />
    <br />
  </div>
</template>

<script>
import sponsors from './sponsors.json'

export default {
  name: 'HomeSponsorsGroup',

  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 140
    }
  },

  computed: {
    list() {
      return sponsors[this.name.toLowerCase()]
    }
  }
}
</script>
