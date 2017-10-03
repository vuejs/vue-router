# 对组件注入

### 注入的属性

通过在 Vue 根实例的 `router` 配置传入 router 实例，下面这些属性成员会被注入到每个子组件。

- #### $router

  router 实例。

- #### $route

  当前激活的[路由信息对象](route-object.md)。这个属性是只读的，里面的属性是 immutable（不可变） 的，不过你可以 watch（监测变化）它。

### 允许的额外配置

- **beforeRouteEnter**
- **beforeRouteUpdate** (在 2.2 加入)
- **beforeRouteLeave**

  查看[组件内的守卫](../advanced/navigation-guards.md#组件内的守卫)。
