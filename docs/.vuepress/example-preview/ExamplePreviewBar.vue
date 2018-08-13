<template>
  <div class="bar-container">
    <template v-if="!viewCode">
      <div class="actions-container">
        <button class="reset-button button" @click="back" :disabled="!previousPage" title="Go back">
          <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;">
            <g>
              <path d="m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z"></path>
            </g>
          </svg>
        </button>
        <button class="reset-button button" @click="forward" :disabled="!nextPage" title="Go forward">
          <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;">
            <g>
              <path d="m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z"></path>
            </g>
          </svg>
        </button>
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
        <button class="reset-button button" title="Edit on CodeSandbox">
          <svg xmlns="http://www.w3.org/2000/svg" class="codesandbox-logo" width="24" height="24" viewBox="0 0 1063 1063" fill="none">
            <path d="M0 317.198V106.046L182.999 0V211.465L0 317.198Z" transform="translate(739.001 551.802)" fill="currentColor" />
            <path d="M179.915 104.303L0 0V208.606L179.915 313.438V104.303Z" transform="translate(142.167 557.135)" fill="currentColor" />
            <path d="M183.546 212.795L366.503 106.633L183.624 0L0 106.987L183.546 212.795Z" transform="translate(348.436 81)" fill="currentColor" />
            <path d="M390 0L0 225.167V675.167" transform="translate(529 305.833)" stroke="currentColor" stroke-width="100" stroke-miterlimit="10" />
            <path d="M0 0L389.333 224" transform="translate(142.167 307)" stroke="currentColor" stroke-width="100" stroke-miterlimit="10" />
            <path d="M0 677.083L389.917 901.042L780 676.333V226L390 0L0 227V677.083Z" transform="translate(141 80)" stroke="currentColor" stroke-width="100" stroke-miterlimit="10" />
          </svg>
        </button>
      </form>
      <button class="reset-button button" @click="$emit('update:viewCode', !viewCode)" :title="viewCode? 'View Demo' : 'View Code'">
        <svg v-if="viewCode" fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 200 200" style="vertical-align: middle;">
          <path d="M27,33 L173,33 C178.522847,33 183,37.4771525 183,43 L183,157 C183,162.522847 178.522847,167 173,167 L27,167 C21.4771525,167 17,162.522847 17,157 L17,43 C17,37.4771525 21.4771525,33 27,33 Z M29,64 L29,156 L171,156 L171,64 L29,64 Z M84.260356,82.6998802 L119.974518,107.161635 C121.797124,108.409995 122.262642,110.899505 121.014282,112.722111 C120.734924,113.129973 120.38238,113.482517 119.974518,113.761875 L84.260356,138.223629 C82.4377502,139.471989 79.9482404,139.006471 78.6998802,137.183866 C78.2439706,136.518238 78,135.730302 78,134.92351 L78,86 C78,83.790861 79.790861,82 82,82 C82.8067925,82 83.594728,82.2439706 84.260356,82.6998802 Z" fill="inherit"></path>
        </svg>
        <svg v-else fill="currentColor" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
          <g>
            <path id="left-bracket" d="M4,12v-1h1c1,0,1,0,1-1V7.614C6,7.1,6.024,6.718,6.073,6.472C6.127,6.22,6.212,6.009,6.33,5.839   C6.534,5.56,6.803,5.364,7.138,5.255C7.473,5.14,8.01,5,8.973,5H10v1H9.248c-0.457,0-0.77,0.191-0.936,0.408   C8.145,6.623,8,6.853,8,7.476v1.857c0,0.729-0.041,1.18-0.244,1.493c-0.2,0.307-0.562,0.529-1.09,0.667   c0.535,0.155,0.9,0.385,1.096,0.688C7.961,12.484,8,12.938,8,13.665v1.862c0,0.619,0.145,0.848,0.312,1.062   c0.166,0.22,0.479,0.407,0.936,0.407L10,17l0,0v1H8.973c-0.963,0-1.5-0.133-1.835-0.248c-0.335-0.109-0.604-0.307-0.808-0.591   c-0.118-0.165-0.203-0.374-0.257-0.625C6.024,16.283,6,15.9,6,15.387V13c0-1,0-1-1-1H4z" />
            <use transform="matrix(-1,0,0,1,24,0)" id="right-bracket" x="0" y="0" width="24" height="24" xlink:href="#left-bracket" />
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
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
  }
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

.reset-button {
  /* reset button style */
  border: none;
  padding: 0;
  margin: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
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
