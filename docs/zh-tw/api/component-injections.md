
# 對組件注入

### 注入的屬性

通過在 Vue 根實例的 `router` 配置傳入 router 實例，下面這些屬性成員會被注入到每個子組件。

- #### $router

  router 實例。

- #### $route

  當前激活的[路由信息對象](route-object.md)。這個屬性是只讀的，裡面的屬性是 immutable（不可變） 的，不過你可以 watch（監測變化）它。

### 允許的額外配置

- **beforeRouteEnter**
- **beforeRouteUpdate** (在 2.2 加入)
- **beforeRouteLeave**

  查看[組件內的守衛](../advanced/navigation-guards.md#組件內的守衛)。

