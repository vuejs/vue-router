# 路由器实例属性

> 这里只列出了公开属性

### `router.app`

- 类型: `Vue`

  此路由器管理的根 Vue 实例。这个实例是由调用 `router.start()` 传入的 Vue 组件构造器函数创建的。

### `router.mode`

- 类型: `String`

  `html5`、`hash` 或者 `abstract`。

  - **`html5`**: 使用 HTML5 history API ，监听 `popstate` 事件。支持 [`saveScrollPosition`](../options.html#savescrollposition) .

  - **`hash`**: 使用 `location.hash` ，监听 `hashchange` 事件。如果创建路由器时声明 `history: true` ，则在不支持 history 模式的路由器下会退化为 hash 模式。

  - **`abstract`**: 不监听任何事件。如果没有 `window` 对象（例如非浏览器环境），则会自动退化到此模式。
