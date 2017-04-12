# Router 实例

### 属性

#### router.app

- 类型: `Vue instance`

  配置了 `router` 的 Vue 根实例。

#### router.mode

- 类型: `string`

  路由使用的 [模式](options.md#mode)。

#### router.currentRoute

- 类型: `Route`

  当前路由对应的 [路由信息对象](route-object.md).

### 方法

- **router.beforeEach(guard)**
- **router.afterEach(hook)**

  增加全局的导航钩子。参考 [导航钩子](../advanced/navigation-guards.md).


- **router.push(location)**
- **router.replace(location)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  动态的导航到一个新 url。参考 [编程式导航](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  解析目标位置（格式和 `<router-link>` 的 `to` prop 一样），返回包含如下属性的对象：

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

- **router.addRoutes(routes)**

  > 2.2.0+

  动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

- **router.onReady(callback)**

  > 2.2.0+

  添加一个会在第一次路由跳转完成时被调用的回调函数。此方法通常用于等待异步的导航钩子完成，比如在进行服务端渲染的时候。
