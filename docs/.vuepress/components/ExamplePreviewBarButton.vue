<template>
  <Promised :promise="svgPromise">
    <button class="reset-button button" slot="pending">.</button>
    <button class="reset-button button" slot-scope="svg" slot="then" v-html="svg"></button>
    <button class="reset-button" slot="catch">?</button>
  </Promised>
</template>

<script>
import Promised from 'vue-promised'

export default {
  props: {
    icon: String
  },

  computed: {
    svgPromise () {
      return import(`!raw-loader!@docs/.vuepress/example-preview/icons/${this.icon}.svg`).then(f => f.default)
    }
  },

  components: { Promised }
}
</script>

<style scoped lang="stylus">
.button {
  color: rgb(135, 135, 135);
  font-size: 1.5rem;
  line-height: 0.5;
  vertical-align: middle;
  text-align: center;
  margin: 0px 0.1rem;

  &:not([disabled]):hover {
    background-color: rgb(226, 226, 226);
    cursor: pointer;
  }

  &[disabled] {
    color: rgb(192, 192, 192);
  }
}
</style>
