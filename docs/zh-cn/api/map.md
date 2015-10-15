# `router.map(routeMap)`

定义路由映射的主要方法。

### 参数

- `routeMap: Object`

  结构体，键为路径，值为路由配置对象。对于路径匹配规则，查看[路由匹配](../route.html#route-matching).

### 路由配置对象

路由配置对象包含两个字段：

- `component`: 当路径匹配时，会渲染到顶级 `<router-view>` 的 Vue 组件。此字段的值可以是调用 `Vue.extend` 后返回的构造函数，或者普通的组件选项对象。在后一种情况下，路由会隐式调用 `Vue.extend` 。

- `subRoutes`: 嵌套的子路由映射。对于每一个 `subRoutes` 映射中的子路由对象，路由器在做匹配时会使用其路径拼接到父级路径后得到的全路径。成功匹配的组件会渲染到父级组件的 `<router-view>` 中。

### 例子

``` js
router.map({
  // 组件构造函数
  '/a': {
    component: Vue.extend({ /* ... */ })
  },
  // 组件选项对象
  '/b': {
    component: {
      template: '<p>Hello from /b</p>'
    }
  },
  // 嵌套的路由
  '/c': {
    component: {
      // 渲染子视图
      template: '<router-view></router-view>'
    },
    subRoutes: {
      // 当路径是 /c/d 时进行渲染
      '/d': { component: { template: 'D' }},
      // 当路径是 /c/e 时进行渲染
      '/e': { component: { template: 'E' }}
    }
  }
})
```
