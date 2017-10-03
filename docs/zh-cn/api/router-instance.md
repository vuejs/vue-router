# Router 实例

### 属性

#### router.app

- 类型: `Vue instance`

  配置了 `router` 的 Vue 根实例。

#### router.mode

- 类型: `string`

  路由使用的[模式](options.md#mode)。

#### router.currentRoute

- 类型: `Route`

  当前路由对应的[路由信息对象](route-object.md)。

### 方法

- **router.beforeEach(guard)**
- **router.beforeResolve(guard) (2.5.0+)**: 此时异步组件已经加载完成
- **router.afterEach(hook)**

  增加全局的导航守卫。参考[导航守卫](../advanced/navigation-guards.md)。

  在 2.5.0+ 这三个方法都返回一个移除已注册的守卫/钩子的函数。

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  动态的导航到一个新 URL。参考[编程式导航](../essentials/navigation.md)。

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

  - `current` 是当前默认的路由 (通常你不需要改变它)
  - `append` 允许你在 `current` 路由上附加路径 (如同 [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  动态添加更多的路由规则。参数必须是一个符合 `routes` 选项要求的数组。

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  该方法把一个回调排队，在路由完成初始导航时调用，这意味着它可以解析所有的异步进入钩子和路由初始化相关联的异步组件。

  这可以有效确保服务端渲染时服务端和客户端输出的一致。

  第二个参数 `errorCallback` 只在 2.4+ 支持。它会在初始化路由解析运行出错 (比如解析一个异步组件失败) 时被调用。

- **router.onError(callback)**

  > 2.4.0+

  注册一个回调，该回调会在路由导航过程中出错时被调用。注意被调用的错误必须是下列情形中的一种：

  - 错误在一个路由守卫函数中被同步抛出；

  - 错误在一个路由守卫函数中通过调用 `next(err)` 的方式异步捕获并处理；

  - 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误。
