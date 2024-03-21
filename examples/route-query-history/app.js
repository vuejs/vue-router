import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname
})

new Vue({
  router,
  data () {
    return {
      historyLength: 0
    }
  },
  template: `
    <div id="app">
      <h1>Route Query History</h1>
      <ul>
        <li><a @click="gotoArray">route-query-history?a=1&b=2&a=2</a></li>
        <li><a @click="gotoOne">route-query-history?a=1&b=2</a></li>
        <li><a @click="gotoTwo">route-query-history?b=2&a=1</a></li>
      </ul>
      <div>
        historyLength:<span id="historyLength">{{historyLength}}</span> 
      </div>
    </div>
  `,
  created () {
    this.historyLength = window.history.length
  },
  methods: {
    gotoArray () {
      window.location.replace('/route-query-history/?a=1&b=2&a=2')
    },
    gotoOne () {
      this.$router.push({ path: '/?a=1&b=2' })
      this.historyLength = window.history.length
    },
    gotoTwo () {
      this.$router.push({ path: '/?b=2&a=1' })
      this.historyLength = window.history.length
    }
  }
}).$mount('#app')
