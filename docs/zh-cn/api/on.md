# `router.on(path, config)`

添加一条顶级的路由配置。在内部实现时，`router.map()` 对于接收到的路由映射对象中每个键值对都调用 `router.on()` 。

### 参数

- `path: String` - 查看[路由匹配](../route.md#route-matching)
- `config: Object` - 查看[路由配置对象](map.md#route-config-object).

### 例子

``` js
router.on('/user/:userId', {
  component: {
    template: '<div>{{$route.params.userId}}</div>'
  }
})
```
