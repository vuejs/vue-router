<template>
  <div class="demo" :class="containerClasses">
    <ExamplePreviewBar :router="router" :view-code.sync="viewCode" :files="files" :current-file.sync="currentFile" />
    <template v-if="viewCode">
      <!-- <ExamplePreviewFilesTabs :files="files" :current-file.sync="currentFile" :view-code.sync="viewCode" /> -->
      <ExamplePreviewExplorer v-if="currentFile" :file="currentFile" />
    </template>
    <template v-else>
      <div class="example">
        <component :is="page" />
      </div>
    </template>
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
      const Page = await (this.pagePath ? import(`@docs/${this.pagePath}/examples/${this.name}/index.js`) : import(`@docs/examples/${this.name}/index.js`))
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
        const handleImport = ({ default: content }) => {
          this.files.push({ name, content })
          if (!this.currentFile) this.currentFile = this.files[this.files.length - 1]
        }
        if (this.pagePath) {
          import(`!raw-loader!@docs/${this.pagePath}/examples/${this.name}/${files[name]}`).then(handleImport)
        } else {
          import(`!raw-loader!@docs/examples/${this.name}/${files[name]}`).then(handleImport)
        }
      })
    }
  },

  computed: {
    containerClasses() {
      return { explorer: this.viewCode } 
    },
    // this seems to be necessary to correctly code split
    // it allows import path to have the slashes in them
    pagePath: ({ $localePath }) => $localePath.replace(/^\//, '').replace(/\/$/, '') 
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
}
.demo .example {
  padding: 1rem 1.5rem;
  overflow: hidden;
}
</style>

