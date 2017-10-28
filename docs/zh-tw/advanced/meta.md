
# 路由元信息

定義路由的時候可以配置 `meta` 欄位：

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

那麼如何訪問這個 `meta` 欄位呢？

首先，我們稱呼 `routes` 配置中的每個路由對象為 **路由記錄**。路由記錄可以是嵌套的，因此，當一個路由匹配成功後，他可能匹配多個路由記錄

例如，根據上面的路由配置，`/foo/bar` 這個 URL 將會匹配父路由記錄以及子路由記錄。

一個路由匹配到的所有路由記錄會暴露為 `$route` 對象（還有在導航守衛中的路有對象）的 `$route.matched` 數組。因此，我們需要遍歷 `$route.matched` 來檢查路由記錄中的 `meta` 欄位。

下面例子展示在全局導航守衛中檢查元欄位：

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 確保一定要調用 next()
  }
})
```

