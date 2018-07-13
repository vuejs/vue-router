<template>
  <p class="demo">
    <ExamplePreviewBar :router="router" />
    <component :is="page" />
  </p>
</template>

<script>
// import Vue from 'vue'
// import Basic from "../examples/basic";
import Router from 'vue-router'
import ExamplePreviewBar from './ExamplePreviewBar'
// import Router from '../../../dist/vue-router.esm'
// import Router from '../../../src/index'

// Vue.use(Router)

export default {
  props: {
    name: String
  },

  data() {
    return {
      router: null,
      page: null
    }
  },

  methods: {
    async loadPage () {
      if (!this.name) return
      const Page = (await import(`../examples/${this.name}/index.js`))
      if (!Page || !Page.App) return
      const { App } = Page
      this.router = App.router = new Router({
        ...App.router.options,
        mode: 'abstract'
      })
      this.router.push('/')
      this.page = App
    }
  },

  watch: {
    name: {
      handler: 'loadPage',
      immediate: true
    }
  },

  components: { ExamplePreviewBar }
}
</script>
