
# 重定向 和 別名

### 重定向

重定向也是通過 `routes` 配置來完成，下面例子是從 `/a` 重定向到 `/b`：

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

重定向的目標也可以是一個命名的路由：

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

甚至是一個方法，動態返回重定向目標：

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目標路由 作為參數
      // return 重定向的 字元串路徑/路徑對象
    }}
  ]
})
```

其它高級用法，請參考[例子](https://github.com/vuejs/vue-router/blob/next/examples/redirect/app.js)。

### 別名

『重定向』的意思是，當用戶訪問 `/a`時，URL 將會被替換成 `/b`，然後匹配路由為 `/b`，那麼『別名』又是什麼呢？

**`/a` 的別名是 `/b`，意味著，當用戶訪問 `/b` 時，URL 會保持為 `/b`，但是路由匹配則為 `/a`，就像用戶訪問 `/a` 一樣。**

上面對應的路由配置為：

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

『別名』的功能讓你可以自由地將 UI 結構映射到任意的 URL，而不是受限於配置的嵌套路由結構。

更多高級用法，請查看[例子](https://github.com/vuejs/vue-router/blob/next/examples/route-alias/app.js)。

