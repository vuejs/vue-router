<template>
  <div class="demo" :class="containerClasses">
    <ExamplePreviewBar :router="router" :view-code.sync="viewCode" />
    <div v-if="viewCode">
      <ExamplePreviewExplorer v-if="currentFile" :file="currentFile" />
    </div>
    <div v-else class="example">
      <component :is="page" />
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import Basic from "../examples/basic";
import Router from 'vue-router'
import ExamplePreviewBar from './ExamplePreviewBar'
import ExamplePreviewExplorer from './ExamplePreviewExplorer'
// import Router from '../../../dist/vue-router.esm'
// import Router from '../../../src/index'

// Vue.use(Router)

export default {
  props: {
    name: String,
    initialView: {
      type: String,
      default: 'demo'
    }
  },

  data() {
    return {
      viewCode: this.initialView === 'code',
      router: null,
      page: null,
      files: [],
      currentFile: null
    }
  },

  methods: {
    async loadPage () {
      if (!this.name) return
      const Page = (await import(`../examples/${this.name}/index.js`))
      if (!Page || !Page.App) return
      let { App, files } = Page

      // create the router again but force the mode to abstract
      this.router = App.router = new Router({
        ...App.router.options,
        mode: 'abstract'
      })
      this.router.push('/')
      this.page = App
      // reset file
      this.currentFile = null

      this.files = []
      // files is usually an object, transform if it's not
      if (Array.isArray(files)) {
        files = files.reduce((filesDict, name) => ({...filesDict, [name]: name}), {})
      }

      // load the content of all the files
      Object.keys(files).forEach(name => {
        import(`!raw-loader!../examples/${this.name}/${files[name]}`).then(({ default: content }) => {
          this.files.push({ name, content })
          if (!this.currentFile) this.currentFile = this.files[this.files.length - 1]
        })
      })
    }
  },

  computed: {
    containerClasses() {
      return { explorer: this.viewCode } 
    }
  },

  watch: {
    name: {
      handler: 'loadPage',
      immediate: true
    }
  },

  components: { ExamplePreviewBar, ExamplePreviewExplorer }
}
</script>

<style scoped>
.demo {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
.demo .example {
  padding: 1rem 1.5rem;
}
</style>

