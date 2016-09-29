# The Route Object

一个 **route object** 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 **route records**（路由参数）。


route object 是 immutable 的，每次成功的导航后都会产生一个新的对象。

route object 能在多个地方找到:

- 组件内的 `this.$route` 和 `$route` watcher 回调;

- `router.match(location)` 的返回值

- 导航 (guard) 守卫的参数：

  ``` js
  router.beforeEach((to, from, next) => {
    // to and from are both route objects
  })
  ```

- `scrollBehavior` 方法的参数:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // to and from are both route objects
    }
  })
  ```

### Route Object Properties

- **$route.path**

  - type: `string`

    字符串，对应当前路由的路径，总是解析为绝对路径，如 `"/foo/bar"`。

- **$route.params**

  - type: `Object`

  一个 key/value 对象，包含了 动态片段 和 全匹配片段，如果没有路由参数，就是一个空对象。

- **$route.query**

  - type: `Object`

    一个 key/value 对象，表示 URL 查询参数。例如，对于路径 `/foo?user=1`，则有 `$route.query.user == 1`，如果没有查询参数，则是个空对象。

- **$route.hash**

  - type: `string`

    当前路由的 hash 值 (不带 `#`) ，如果没有 hash 值，则为空字符串。


- **$route.fullPath**

  - type: `string`

    完成解析后的 URL，包含查询参数和 hash 的完整路径。

- **$route.matched**

  - type: `Array<RouteRecord>`

  一个数组，包含当前路由的所有嵌套路径片段 **route records** 。Route records 就是 `routes` 配置数组中的对象副本（还有在 `children` 数组）。

  ``` js
  const router = new VueRouter({
    routes: [
      // 下面的对象就是 route record
      { path: '/foo', component: Foo,
        children: [
          // 这也是个 route record
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  当 URL 为 `/foo/bar`，`$route.matched` 将会是一个包含从上到下的所有对象（副本）。

- **$route.name**

  当前路由的名称，如果有的话。（查看 [命名路由](../essentials/named-routes.md)）
