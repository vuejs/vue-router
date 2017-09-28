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
- **router.beforeResolve(guard) (2.5.0+)**: 此时异步组件已经加载完成
- **router.afterEach(hook)**

  增加全局的导航钩子。参考 [导航钩子](../advanced/navigation-guards.md).
  <!-- todo translation -->
  In 2.5.0+ all three methods return a function that removes the registered guard/hook.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
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
  <!-- todo translation -->
  - `current` is the current Route by default (most of the time you don't need to change this)
  - `append` allows you to append the path to the `current` route (as with [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

- **router.onReady(callback, [errorCallback])**
  <!-- todo translation -->
  > 2.2.0+

  This method queues a callback to be called when the router has completed the initial navigation, which means it has resolved all async enter hooks and async components that are associated with the initial route.

  This is useful in server-side rendering to ensure consistent output on both the server and the client.

  The second argument `errorCallback` is only supported in 2.4+. It will be called when the initial route resolution runs into an error (e.g. failed to resolve an async component).

- **router.onError(callback)**

  > 2.4.0+

  Register a callback which will be called when an error is caught during a route navigation. Note for an error to be called, it must be one of the following scenarios:

  - The error is thrown synchronously inside a route guard function;

  - The error is caught and asynchronously handled by calling `next(err)` inside a route guard function;

  - An error occurred when trying to resolve an async component that is required to render a route.
