<template>
  <div class="bar-container">
    <template v-if="!viewCode">
      <div class="actions-container">
        <ExamplePreviewBarButton icon="left-arrow" @click.native="back" :disabled="!previousPage" title="Go back" />
        <ExamplePreviewBarButton icon="right-arrow" @click.native="forward" :disabled="!nextPage" title="Go forward" />
      </div>
      <div class="uri-container">
        <input class="uri" :disabled="!router" :value="uri" @keyup.enter="navigate">
      </div>
    </template>
    <div class="tabs-container" v-else>
      <button class="reset-button tab" v-for="file in files" :class="file === currentFile ? 'is-selected' : ''" @click="$emit('update:currentFile', file)">
        {{ file.name }}
      </button>
    </div>
    <div class="actions-container">
      <form v-if="viewCode && codesandboxParams" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
        <input type="hidden" name="parameters" :value="codesandboxParams">
        <ExamplePreviewBarButton icon="codesandbox" title="Edit on CodeSandbox" />
      </form>
      <ExamplePreviewBarButton :icon="viewCode ? 'play-window' : 'brackets'" @click.native="$emit('update:viewCode', !viewCode)" :title="viewCode? 'View Demo' : 'View Code'" />
    </div>
  </div>
</template>

<script>
import ExamplePreviewBarButton from '@docs/.vuepress/components/ExamplePreviewBarButton'

export default {
  props: {
    router: Object,
    files: Array,
    currentFile: Object,
    viewCode: Boolean,
    codesandboxParams: String
  },

  computed: {
    uri() {
      return this.router ? this.router.currentRoute.fullPath : '/'
    },
    history() {
      return this.router && this.router.history
    },
    previousPage() {
      return this.history ? this.history.stack[this.history.index - 1] : ''
    },
    nextPage() {
      return this.history ? this.history.stack[this.history.index + 1] : ''
    }
  },

  methods: {
    back() {
      this.router.go(-1)
    },
    forward() {
      this.router.go(1)
    },
    navigate({ target }) {
      this.router.push(target.value)
    }
  },

  components: { ExamplePreviewBarButton }
}
</script>

<style scoped lang="stylus">
@import '~@default-theme/styles/config.styl';

.bar-container {
  display: flex;
  border-radius: 4px 4px 0 0;
  background-color: rgb(242, 242, 242);
  padding: 0 0.5rem;
  align-items: center;
  line-height: 1;
  box-shadow: rgb(221, 221, 221) 0px 1px 3px;
  height: 2.5rem;
  min-height: 2.5rem;
  margin-bottom: 0;
}

.actions-container {
  // Make sure they appar in line
  display: flex;
}

.uri-container, .tabs-container {
  flex-grow: 1;
}

.tabs-container {
  display: flex;
  height: 100%;
  margin-left: -0.5rem;
  overflow-x: auto;
}

.tab {
  height: 100%;
  font-size: 0.9rem;
  padding: 0 0.7rem;
  line-height: 2.5rem;
  color: #666;

  &:hover {
    cursor: pointer;
  }

  &.is-selected {
    color: inherit;
    font-weight: 500;
    border-bottom: 3px solid $accentColor;
    background-color: rgba(0, 0, 0, 0.075);
  }
}

.uri {
  box-sizing: border-box;
  width: 100%;
  color: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  padding: 0.2rem 0.5rem;
  vertical-align: middle;
  font-size: 1rem;
}

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
