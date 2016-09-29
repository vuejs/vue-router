# 对组件注入

### 注入的属性


通过在 Vue 根实例的 `router` 配置传入 router 实例，下面这些属性成员会被注入到每个子组件。

- #### $router

  router 实例.

- #### $route

  当前激活的 [路由信息对象](route-object.md)。这个属性是只读的，里面的属性是 immutable 的，不过你可以 watch 它。

### 组件增加配置

- **beforeRouteEnter**
- **beforeRouteLeave**

  查看 [组件级导航卫士](../advanced/navigation-guards.md#incomponent-guards).
