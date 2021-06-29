
# 滾動行為

使用前端路由，當切換到新路由時，想要頁面滾到頂部，或者是保持原先的滾動位置，就像重新加載頁面那樣。 `vue-router` 能做到，而且更好，它讓你可以自定義路由切換時頁面如何滾動。

**注意: 這個功能只在 HTML5 history 模式下可用。**

當創建一個 Router 實例，你可以提供一個 `scrollBehavior` 方法：

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滾動到哪個的位置
  }
})
```

`scrollBehavior` 方法接收 `to` 和 `from` 路由對象。第三個參數 `savedPosition` 若且唯若 `popstate` 導航 (通過瀏覽器的 前進/後退 按鈕觸發) 時才可用。

這個方法返回滾動位置的對象信息，長這樣：

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}` (offset 只在 2.6.0+ 支持)

如果返回一個 falsy (譯者註：falsy 不是 `false`，[參考這裡](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy))的值，或者是一個空對象，那麼不會發生滾動。

舉例：

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

對於所有路由導航，簡單地讓頁面滾動到頂部。

返回 `savedPosition`，在按下 後退/前進 按鈕時，就會像瀏覽器的原生表現那樣：

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

如果你要模擬『滾動到錨點』的行為：

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

我們還可以利用[路由元信息](meta.md)更細顆粒度地控制滾動。查看完整例子請[移步這裡](https://github.com/vuejs/vue-router/blob/next/examples/scroll-behavior/app.js)。

