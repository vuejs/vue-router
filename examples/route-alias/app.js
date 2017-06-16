import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Root = { template: '<div>root</div>' }
const Home = { template: '<div><h1>Home</h1><router-view></router-view></div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Baz = { template: '<div>baz</div>' }
const Default = { template: '<div>default</div>' }
const Nested = { template: '<router-view/>' }
const NestedFoo = { template: '<div>nested foo</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/root', component: Root, alias: '/root-alias' },
    { path: '/home', component: Home,
      children: [
        // absolute alias
        { path: 'foo', component: Foo, alias: '/foo' },
        // relative alias (alias to /home/bar-alias)
        { path: 'bar', component: Bar, alias: 'bar-alias' },
        // multiple aliases
        { path: 'baz', component: Baz, alias: ['/baz', 'baz-alias'] },
        // default child route with empty string as alias.
        { path: 'default', component: Default, alias: '' },
        // nested alias
        { path: 'nested', component: Nested, alias: 'nested-alias',
          children: [
            { path: 'foo', component: NestedFoo }
          ]
        }
      ]
    }
  ]
})

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Route Alias</h1>
      <ul>
        <li><router-link to="/root-alias">
          /root-alias (renders /root)
        </router-link></li>

        <li><router-link to="/foo">
          /foo (renders /home/foo)
        </router-link></li>

        <li><router-link to="/home/bar-alias">
          /home/bar-alias (renders /home/bar)
        </router-link></li>

        <li><router-link to="/baz">
          /baz (renders /home/baz)
        </router-link></li>

        <li><router-link to="/home/baz-alias">
          /home/baz-alias (renders /home/baz)
        </router-link></li>

        <li><router-link to="/home">
          /home (renders /home/default)
        </router-link></li>

        <li><router-link to="/home/nested-alias/foo">
          /home/nested-alias/foo (renders /home/nested/foo)
        </router-link></li>
      </ul>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')
