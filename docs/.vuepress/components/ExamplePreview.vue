<template>
  <div class="demo" :class="containerClasses">
    <ExamplePreviewBar :router="router" :view-code.sync="viewCode" :files="files" :current-file.sync="currentFile" :codesandbox-params="codesandboxParams" />
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
import Router from 'vue-router'
import ExamplePreviewBar from '../example-preview/ExamplePreviewBar'
import ExamplePreviewExplorer from '../example-preview/ExamplePreviewExplorer'
import { getCodesandboxParameters, removeScriptSection } from '../example-preview/utils'

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
      currentFile: null,
      codesandboxParams: null
    }
  },

  methods: {
    async loadPage () {
      if (!this.name) return
      const Page = await (this.pagePath ? import(`@docs/${this.pagePath}/examples/${this.name}/index.js`) : import(`@docs/examples/${this.name}/index.js`))
      if (!Page || !Page.App) return
      let { App, files, codesandbox } = Page

      // create the router again but force the mode to abstract
      this.router = App.router = new Router({
        ...App.router.options,
        mode: 'abstract'
      })
      this.router.push('/')
      this.page = App
      // reset file
      this.currentFile = null
      this.codesandboxParams = null

      this.files = []
      // files is usually an object, transform if it's not
      if (Array.isArray(files)) {
        files = files.reduce((filesDict, name) => ({...filesDict, [name]: name}), {})
      }

      // load the content of all the files
      Object.keys(files).forEach(name => {
        const handleImport = ({ default: content }) => {
          // remove the script part that contains the router
          if (name === 'App.vue') {
            content = removeScriptSection(content)
          }
          this.files.push({ name, content })
          if (!this.currentFile) this.currentFile = this.files[this.files.length - 1]
        }
        if (this.pagePath) {
          import(`!raw-loader!@docs/${this.pagePath}/examples/${this.name}/${files[name]}`).then(handleImport)
        } else {
          import(`!raw-loader!@docs/examples/${this.name}/${files[name]}`).then(handleImport)
        }
      })

      if (!codesandbox || !codesandbox.length) return
      const allFiles = codesandbox.map(filename => {
        const transformFile = ({ default: content }) => {
          // remove the script part from App.vue because it has the router
          if (filename === 'App.vue') {
            content = removeScriptSection(content)
          }
          return {
            [filename]: { content }
          }
        }
        if (this.pagePath) {
          return import(`!raw-loader!@docs/${this.pagePath}/examples/${this.name}/${filename}`).then(transformFile)
        } else {
          return import(`!raw-loader!@docs/examples/${this.name}/${filename}`).then(transformFile)
        }
      })

      // add the entry point (common for all examples) main.js
      if (codesandbox.indexOf('main.js') < 0) {
        allFiles.push(import(`!raw-loader!@docs/examples/common/main.js`).then(({ default: content })=> ({
          'main.js': { content }
        })))
      }

      this.codesandboxParams = await Promise.all(allFiles).then(getCodesandboxParameters)
    }
  },

  computed: {
    containerClasses() {
      return { explorer: this.viewCode }
    },
    // this seems to be necessary to correctly code split
    // it allows import path to have the slashes in them
    pagePath () {
      return this.$localePath.replace(/^\//, '').replace(/\/$/, '')
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
}
.demo .example {
  padding: 1rem 1.5rem;
  overflow: hidden;
}
</style>

