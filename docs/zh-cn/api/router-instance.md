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

- **router.getMatchedComponents()**

  返回当前路由匹配的组件数组（是数组的定义/构造类，不是实例）。通常在服务端渲染的数据预加载时时候。
