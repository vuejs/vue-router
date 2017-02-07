# 路由信息对象

一个 **route object（路由信息对象）** 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的 **route records（路由记录）**。


route object 是 immutable（不可变） 的，每次成功的导航后都会产生一个新的对象。

route object 出现在多个地方:

- 组件内的 `this.$route` 和 `$route` watcher 回调（监测变化处理）;

- `router.match(location)` 的返回值

- 导航钩子的参数：

  ``` js
  router.beforeEach((to, from, next) => {
    // to 和 from 都是 路由信息对象
  })
  ```

- `scrollBehavior` 方法的参数:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // to 和 from 都是 路由信息对象
    }
  })
  ```

### 路由信息对象的属性

- **$route.path**

  - 类型: `string`

    字符串，对应当前路由的路径，总是解析为绝对路径，如 `"/foo/bar"`。

- **$route.params**

  - 类型: `Object`

  一个 key/value 对象，包含了 动态片段 和 全匹配片段，如果没有路由参数，就是一个空对象。

- **$route.query**

  - 类型: `Object`

    一个 key/value 对象，表示 URL 查询参数。例如，对于路径 `/foo?user=1`，则有 `$route.query.user == 1`，如果没有查询参数，则是个空对象。

- **$route.hash**

  - 类型: `string`

    当前路由的 hash 值 (带 `#`) ，如果没有 hash 值，则为空字符串。


- **$route.fullPath**

  - 类型: `string`

    完成解析后的 URL，包含查询参数和 hash 的完整路径。

- **$route.matched**

  - 类型: `Array<RouteRecord>`

  一个数组，包含当前路由的所有嵌套路径片段的 **路由记录** 。路由记录就是 `routes` 配置数组中的对象副本（还有在 `children` 数组）。

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
