<template>
  <div class="bar-container">
    <div>
      <button class="button" @click="back" :disabled="!previousPage">
        <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;">
          <g>
            <path d="m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z"></path>
          </g>
        </svg>
      </button>
      <button class="button" @click="forward" :disabled="!nextPage">
        <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;">
          <g>
            <path d="m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z"></path>
          </g>
        </svg>
      </button>
      <button class="button" v-if="false">
        <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;">
          <g>
            <path d="m29.5 10.5l3.9-3.9v11.8h-11.8l5.4-5.4c-1.8-1.8-4.3-3-7-3-5.5 0-10 4.5-10 10s4.5 10 10 10c4.4 0 8.1-2.7 9.5-6.6h3.4c-1.5 5.7-6.6 10-12.9 10-7.3 0-13.3-6.1-13.3-13.4s6-13.4 13.3-13.4c3.7 0 7 1.5 9.5 3.9z"></path>
          </g>
        </svg>
      </button>
    </div>
    <div class="uri-container">
      <input class="uri" :disabled="!router" :value="uri" @keyup.enter="navigate">
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      router: Object
    },

    computed: {
      uri: ({ router }) => router ? router.currentRoute.fullPath : '/',
      history: ({ router }) => router && router.history,
      previousPage: ({ history }) => history ? history.stack[history.index - 1] : '',
      nextPage: ({ history }) => history ? history.stack[history.index + 1] : '',
    },

    methods: {
      back () {
        this.router.go(-1)
      },
      forward () {
        this.router.go(1)
      },
      navigate ({ target }) {
        this.router.push(target.value)
      }
    }
  }
</script>

<style scoped>
.bar-container {
  display: flex;
  border-radius: 4px 4px 0 0;
  background-color: rgb(242, 242, 242);
  padding: 0.1rem 0.5rem;
  align-items: center;
  line-height: 1;
  box-shadow: rgb(221, 221, 221) 0px 1px 3px;
  height: 2.5rem;
  min-height: 2.5rem;
  /* remove padding added by .demo container*/
  margin: -1rem -1.5rem;
}

.uri-container {
  flex-grow: 1;
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
  display: inline-block;
  background-color: transparent;
  color: rgb(135, 135, 135);
  font-size: 1.5rem;
  line-height: 0.5;
  vertical-align: middle;
  text-align: center;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  margin: 0px 0.1rem;
  padding: 0px;
  outline: none;
}

.button:not([disabled]):hover {
  background-color: rgb(226, 226, 226);
  cursor: pointer;
}

.button[disabled] {
  color: rgb(192, 192, 192);
}
</style>
