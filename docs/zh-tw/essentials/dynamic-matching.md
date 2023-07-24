
# 動態路由匹配

我們經常需要把某種模式匹配到的所有路由，全都映射到同個組件。例如，我們有一個 `User` 組件，對於所有 ID 各不相同的用戶，都要使用這個組件來渲染。那麼，我們可以在  `vue-router` 的路由路徑中使用『動態路徑參數』（dynamic segment）來達到這個效果：

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 動態路徑參數 以冒號開頭
    { path: '/user/:id', component: User }
  ]
})
```

現在呢，像 `/user/foo` 和 `/user/bar` 都將映射到相同的路由。

一個『路徑參數』使用冒號 `:` 標記。當匹配到一個路由時，參數值會被設置到
 `this.$route.params`，可以在每個組件內使用。於是，我們可以更新 `User` 的模板，輸出當前用戶的 ID：

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

你可以看看這個[在線例子](https://jsfiddle.net/yyx990803/4xfa2f19/)。

你可以在一個路由中設置多段『路徑參數』，對應的值都會設置到 `$route.params` 中。例如：

| 模式 | 匹配路徑 | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

除了 `$route.params` 外，`$route` 對象還提供了其它有用的信息，例如，`$route.query`（如果 URL 中有查詢參數）、`$route.hash` 等等。你可以查看 [API 文檔](../api/route-object.md) 的詳細說明。

### 響應路由參數的變化

提醒一下，當使用路由參數時，例如從 `/user/foo` 導航到 `user/bar`，**原來的組件實例會被復用**。因為兩個路由都渲染同個組件，比起銷毀再創建，復用則顯得更加高效。**不過，這也意味著組件的生命週期鈎子不會再被調用**。

復用組件時，想對路由參數的變化作出響應的話，你可以簡單地 watch（監測變化） `$route` 對象：

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 對路由變化作出響應...
    }
  }
}
```

或者使用 2.2 中引入的 `beforeRouteUpdate` 守衛：

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```

### 高級匹配模式

`vue-router` 使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 作為路徑匹配引擎，所以支持很多高級的匹配模式，例如：可選的動態路徑參數、匹配零個或多個、一個或多個，甚至是自定義正則匹配。查看它的 [文檔](https://github.com/pillarjs/path-to-regexp#parameters) 學習高階的路徑匹配，還有 [這個例子 ](https://github.com/vuejs/vue-router/blob/next/examples/route-matching/app.js) 展示 `vue-router` 怎麼使用這類匹配。

### 匹配優先級

有時候，同一個路徑可以匹配多個路由，此時，匹配的優先級就按照路由的定義順序：誰先定義的，誰的優先級就最高。

