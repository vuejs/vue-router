import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Foo = {
  template: '<div class="current">foo</div>',
  beforeRouteEnter (to, from, next) {
    // in-component beforeRouteEnter hook
    next(vm => {
      // print log
      app.logText = 'beforeRouteEnter callback emited'
    })
  }
}

const Bar = { template: '<div class="current">bar</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    // foo1
    { path: '/foo1', component: Foo },

    // foo2, same component as foo1
    { path: '/foo2', component: Foo },

    // bar
    { path: '/bar', component: Bar }
  ]
})

const app = new Vue({
  data: {
    applyKeepAlive: false,
    logText: ''
  },
  router,
  template: `
    <div id="app">
      <h1>Navigation Guard Callback</h1>
      <ul>
        <li><router-link to="/" id="root">/</router-link></li>
        <li><router-link to="/foo1" id="foo1">/foo1</router-link></li>
        <li><router-link to="/foo2" id="foo2">/foo2</router-link></li>
        <li><router-link to="/bar" id="bar">/bar</router-link></li>
      </ul>
      <div v-if="applyKeepAlive" class="keep-alive-wrap">
        <keep-alive>
          <router-view class="view"></router-view>
        </keep-alive>
      </div>
      <div v-else>
        <router-view class="view"></router-view>
      </div>
      <div class="log">{{logText}}</div>
      <div>
        <button class="btn-apply-keep-alive" @click="toggle">apply keep-alive</button>
        <button class="btn-clear-log" @click="clear">clear log</button>
      </div>
    </div>
  `,
  methods: {
    toggle () {
      // wrap router-view with keep-alive
      this.applyKeepAlive = true
    },
    clear () {
      // clear log
      this.logText = ''
    }
  }
}).$mount('#app')
