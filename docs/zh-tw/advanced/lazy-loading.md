
# 路由懶加載

當打包構建應用時，Javascript 包會變得非常大，影響頁面加載。如果我們能把不同路由對應的組件分割成不同的代碼塊，然後當路由被訪問的時候才加載對應組件，這樣就更加高效了。

結合 Vue 的[非同步組件](https://cn.vuejs.org/guide/components.html#非同步組件)和 Webpack 的[代碼分割功能](https://doc.webpack-china.org/guides/code-splitting-async/#require-ensure-/)，輕鬆實現路由組件的懶加載。

首先，可以將非同步組件定義為返回一個 Promise 的工廠函數 (該函數返回的 Promise 應該 resolve 組件本身)：

``` js
const Foo = () => Promise.resolve({ /* 組件定義對象 */ })
```

第二，在 Webpack 2 中，我們可以使用[動態 import](https://github.com/tc39/proposal-dynamic-import)語法來定義代碼分塊點 (split point)：

``` js
import('./Foo.vue') // 返回 Promise
```

> 注意：如果您使用的是 Babel，你將需要添加 [`syntax-dynamic-import`](https://babeljs.io/docs/plugins/syntax-dynamic-import/) 插件，才能使 Babel 可以正確地解析語法。

結合這兩者，這就是如何定義一個能夠被 Webpack 自動代碼分割的非同步組件。

``` js
const Foo = () => import('./Foo.vue')
```

在路由配置中什麼都不需要改變，只需要像往常一樣使用 `Foo`：

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 把組件按組分塊

有時候我們想把某個路由下的所有組件都打包在同個非同步塊 (chunk) 中。只需要使用 [命名 chunk](https://webpack.js.org/guides/code-splitting-require/#chunkname)，一個特殊的註釋語法來提供 chunk name (需要 Webpack > 2.4)。

``` js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

Webpack 會將任何一個非同步模組與相同的塊名稱組合到相同的非同步塊中。

