# `router.start(App, el)`

启动一个启用了路由的应用。创建一个 `App` 的实例并且挂载到元素 `el` 。

### 参数

- `App: Function | Object`

  `App` 可以是 Vue 组件构造函数或者一个组件选项对象。如果是一个对象，路由会隐式的对其调用 `Vue.extend` 。这个组件会用来创建这个应用的根组件。

- `el: String | Element`

  挂载应用的元素。可以是 CSS 选择符或者一个实际的元素。
