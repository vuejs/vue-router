# `router.beforeEach(hook)`

设置全局的前置勾子函数，这个函数会在路由切换开始时调用。调用发生在整个切换流水线之前。如果此钩子函数拒绝了切换，整个切换流水线根本就不会启动。

注意，只能有一个全局的前置勾子函数。但是你可以在这个勾子函数内实现自己的中间件系统。

### 参数

- `hook {Function}`

  此勾子函数一个类型为[切换对象](../pipeline/hooks.html#transition-object)的参数。

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
