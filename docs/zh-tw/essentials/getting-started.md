
# Getting Started

> 教程中的案例代碼將使用 [ES2015](https://github.com/lukehoban/es6features) 來編寫。

用 Vue.js + vue-router 創建單頁應用，是非常簡單的。使用 Vue.js ，我們已經可以通過組合組件來組成應用程序，當你要把 vue-router 添加進來，我們需要做的是，將組件(components)映射到路由(routes)，然後告訴 vue-router 在哪裡渲染它們。下面是個基本例子：

> 所有的例子都將使用完整版的 Vue 以解析模板。更多細節請[移步這裡](https://cn.vuejs.org/v2/guide/installation.html#運行時-編譯器-vs-只包含運行時)。

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 組件來導航. -->
    <!-- 通過傳入 `to` 屬性指定連結. -->
    <!-- <router-link> 默認會被渲染成一個 `<a>` 標籤 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的組件將渲染在這裡 -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. 如果使用模組化機制編程，導入Vue和VueRouter，要調用 Vue.use(VueRouter)

// 1. 定義（路由）組件。
// 可以從其他文件 import 進來
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定義路由
// 每個路由應該映射一個組件。 其中"component" 可以是
// 通過 Vue.extend() 創建的組件構造器，
// 或者，只是一個組件配置對象。
// 我們晚點再討論嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 創建 router 實例，然後傳 `routes` 配置
// 你還可以傳別的配置參數, 不過先這麼簡單著吧。
const router = new VueRouter({
  routes // （縮寫）相當於 routes: routes
})

// 4. 創建和掛載根實例。
// 記得要通過 router 配置參數注入路由，
// 從而讓整個應用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 現在，應用已經啟動了！
```

你可以看看這個例子
[live](https://jsfiddle.net/yyx990803/xgrjzsup/)。

要注意，當 `<router-link>` 對應的路由匹配成功，將自動設置 class 屬性值  `.router-link-active`。查看 [API 文檔](../api/router-link.md) 學習更多相關內容。
`
