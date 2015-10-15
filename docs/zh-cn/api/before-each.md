# `router.beforeEach(hook)`

添加一个全局的前置钩子函数，这个函数会在路由切换开始时调用。调用发生在整个切换流水线之前。如果此钩子函数拒绝了切换，整个切换流水线根本就不会启动。

你可以注册多个全局的前置钩子函数。这些函数会按照注册的顺序被调用。调用是异步的，后一个函数会等待前一个函数完成后才会被调用。

### 参数

- `hook {Function}`

  此钩子函数一个类型为[切换对象](../pipeline/hooks.html#transition-object)的参数。

### Example

简单示例

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

使用 Promise 和 ES6

``` js
router.beforeEach(function ({ to, next }) {
  if (to.path === '/auth-required') {
    // 返回一个断定会 true 或者 false 的 Promise
    return AuthService.isLoggedIn()
  } else {
    next()
  }
})
```
