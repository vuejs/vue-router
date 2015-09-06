# 切换过程中的勾子

在切换过程中，`<router-view>` 组件可以通过实现一些勾子函数来控制切换过程。这些勾子函数包括：

- `data`
- `activate`
- `deactivate`
- `canActivate`
- `canDeactivate`
- `canReuse`

你可以在组件的 `route` 选项中实现这些函数。

``` js
Vue.component('hook-example', {
  // ... other options
  route: {
    activate: function (transition) {
      console.log('hook-example activated!')
      transition.next()
    },
    deactivate: function (transition) {
      console.log('hook-example deactivated!')
      transition.next()
    }
  }
})
```

### 切换对象

每个切换勾子函数都会接受一个 `transition` 对象作为参数。这个切换对象包含以下函数和方法：

- **transition.from**

  一个代表将要切换到的路径的[路由对象](../route.md)。

- **transition.to**

  一个代表当前路径的路由对象。

- **transition.next()**

  调用此函数处理切换过程的下一步。

- **transition.abort([reason])**

  调用此函数来终止或者拒绝此次切换。

- **transition.redirect(path)**

  取消当前切换并重定向到另一个路由。

所有的切换勾子默认都被当作异步的。想要控制切换的进度， 你有三个选择：

1. 显示的调用 `next`, `abort` 或者 `redirect` 。

2. 返回一个 Promise ，详情见下文。

3. 对于验证的勾子（ `canActivate` 和 `canDeactivate` ），你可以同步的返回一个 Boolean 值。

### 在勾子中返回Promise

当在勾子函数中返回一个 Promise 时，系统会在 Promise 断定（ resolve ）之后自动调用`transition.next`。如果 Promise 在验证阶段被拒绝（ rejected )，系统会调用 `transition.abort` ；如果是在激活阶段被调用，系统会调用 `transition.next` 。

对于激活阶段的勾子（ `canActivate` 和 `canDeactivate` ），如果 Promise 断定（ resolved ）之后的值是假值（ falsy ），系统会中断此次切换。

如果一个被拒绝（ rejected ）的 Promise 抛出了未捕获的异常，这个异常会继续向上抛出，除非在创建路由器的时候启用了参数 `suppressTransitionError` 。

**例子：**

``` js
// 在组件定义内部
route: {
  canActivate: function () {
    // 假设此 service 返回一个 Promise ，这个 Promise 被断定后
    // 的值是 `true` 或者 `false`
    return authenticationService.isLoggedIn()
  },
  activate: function (transition) {
    return messageService
      .fetch(transition.to.params.messageId)
      .then((message) => {
        // 获取数据后更新 data
        // 组件知道此函数执行过后才会被展示出来
        this.message = message
      })
  }
}
```

此处，我们在 `activate` 勾子中异步的获取数据，因为这里仅仅是做个示例；注意通常我们可以使用[ `data` 勾子](data.md)来做这些，它会更加适合。

**提示：** 如果使用 ES6 ，可以使用参数解构（ argument destructuring ）使勾子更加简洁：

``` js
route: {
  activate ({ next }) {
    // when done:
    next()
  }
}
```

查看 vue-router 中的[高级示例](https://github.com/vuejs/vue-router/tree/dev/example/advanced)
