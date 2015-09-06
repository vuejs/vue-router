# `router.stop()`

停止监听 `popstate` 和 `hashchange` 事件。

注意，当路由处于停止状态，`router.app` 并没有销毁，你依然可以使用 `router.go(path)` 进行跳转。你也可以不使用参数调用 `router.start()` 来重新启动路由。
