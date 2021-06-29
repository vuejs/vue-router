
# 路由信息對象

一個 **route object（路由信息對象）** 表示當前激活的路由的狀態信息，包含了當前 URL 解析得到的信息，還有 URL 匹配到的 **route records（路由記錄）**。

route object 是 immutable（不可變） 的，每次成功的導航後都會產生一個新的對象。

route object 出現在多個地方:

- 在組件內，即 `this.$route`

- 在 `$route` 觀察者回調內

- `router.match(location)` 的返回值

- 導航守衛的參數：

  ``` js
  router.beforeEach((to, from, next) => {
    // to 和 from 都是 路由信息對象
  })
  ```

- `scrollBehavior` 方法的參數:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // to 和 from 都是 路由信息對象
    }
  })
  ```

### 路由信息對象的屬性

- **$route.path**

  - 類型: `string`

    字元串，對應當前路由的路徑，總是解析為絶對路徑，如 `"/foo/bar"`。

- **$route.params**

  - 類型: `Object`

  一個 key/value 對象，包含了 動態片段 和 全匹配片段，如果沒有路由參數，就是一個空對象。

- **$route.query**

  - 類型: `Object`

    一個 key/value 對象，表示 URL 查詢參數。例如，對於路徑 `/foo?user=1`，則有 `$route.query.user == 1`，如果沒有查詢參數，則是個空對象。

- **$route.hash**

  - 類型: `string`

    當前路由的 hash 值 (帶 `#`) ，如果沒有 hash 值，則為空字元串。

- **$route.fullPath**

  - 類型: `string`

    完成解析後的 URL，包含查詢參數和 hash 的完整路徑。

- **$route.matched**

  - 類型: `Array<RouteRecord>`

  一個數組，包含當前路由的所有嵌套路徑片段的 **路由記錄** 。路由記錄就是 `routes` 配置數組中的對象副本（還有在 `children` 數組）。

  ``` js
  const router = new VueRouter({
    routes: [
      // 下面的對象就是 route record
      { path: '/foo', component: Foo,
        children: [
          // 這也是個 route record
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  當 URL 為 `/foo/bar`，`$route.matched` 將會是一個包含從上到下的所有對象（副本）。

- **$route.name**

  當前路由的名稱，如果有的話。（查看 [命名路由](../essentials/named-routes.md)）

