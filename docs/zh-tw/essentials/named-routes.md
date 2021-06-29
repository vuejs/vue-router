
# 命名路由

有時候，通過一個名稱來標識一個路由顯得更方便一些，特別是在連結一個路由，或者是執行一些跳轉的時候。你可以在創建 Router 實例的時候，在 `routes` 配置中給某個路由設置名稱。

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

要連結到一個命名路由，可以給 `router-link` 的 `to` 屬性傳一個對象：

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

這跟代碼調用 `router.push()` 是一回事：

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

這兩種方式都會把路由導航到 `/user/123` 路徑。

完整的例子請[移步這裡](https://github.com/vuejs/vue-router/blob/next/examples/named-routes/app.js)。

