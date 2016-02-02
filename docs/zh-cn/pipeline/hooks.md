# 切换过程中的钩子

在切换过程中，`<router-view>` 组件可以通过实现一些钩子函数来控制切换过程。这些钩子函数包括：

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

每个切换钩子函数都会接受一个 `transition` 对象作为参数。这个切换对象包含以下函数和方法：

- **transition.to**

  一个代表将要切换到的路径的[路由对象](../route.md)。

- **transition.from**

  一个代表当前路径的路由对象。

- **transition.next()**

  调用此函数处理切换过程的下一步。

- **transition.abort([reason])**

  调用此函数来终止或者拒绝此次切换。

- **transition.redirect(path)**

  取消当前切换并重定向到另一个路由。

### 钩子函数异步 resolve 规则

我们经常需要在钩子函数中进行异步操作。在一个异步的钩子被 resolve 之前，切换会处于暂停状态。钩子的 resolve 遵循以下规则：

1. 如果钩子返回一个 Promise，则钩子何时 resolve 取决于该 Promise 何时 resolve。[更多细节](#%E5%9C%A8%E9%92%A9%E5%AD%90%E4%B8%AD%E8%BF%94%E5%9B%9E-promise)

2. 如果钩子既不返回 Promise，也没有任何参数，则该钩子将被同步 resolve。例如：

  ``` js
  route: {
    activate: function (/* 没有参数 */) {
      // 如果不返回 Promise，则同步 resolve
    }
  }
  ```

3. 如果钩子不返回 Promise，但是有一个参数 (`transition`)，则钩子会等到 `transition.next()`, `transition.abort()` 或是 `transition.redirect()` 之一被调用才 resolve。例如：

  ``` js
  route: {
    activate: function (transition) {
      // 一秒后 resolve
      setTimeout(transition.next, 1000)
    }
  }
  ```

4. 在验证类的钩子，比如 `canActivate`, `canDeactivate` 以及[全局 beforeEach 钩子](../api/before-each.md) 中，如果返回值是一个布尔值 (Boolean)，也会使得钩子同步 resolve。

### 在钩子中返回 Promise

- 当在钩子函数中返回一个 Promise 时，系统会在该 Promise 被 resolve 之后自动调用`transition.next`。

- 如果 Promise 在验证阶段被 reject，系统会调用 `transition.abort`。

- 如果 Promise 在激活阶段被 reject，系统会调用 `transition.next` 。

- 对于验证类钩子（ `canActivate` 和 `canDeactivate` ），如果 Promise resolve 之后的值是假值（ falsy value ），系统会中断此次切换。

- 如果一个被 reject 的 Promise 抛出了未捕获的异常，这个异常会继续向上抛出，除非在创建路由器的时候启用了参数 `suppressTransitionError` 。

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

此处，我们在 `activate` 钩子中异步的获取数据，因为这里仅仅是做个示例；注意通常我们可以使用[ `data` 钩子](data.md)来做这些，它会更加适合。

**提示：** 如果使用 ES6 ，可以使用参数解构（ argument destructuring ）使钩子更加简洁：

``` js
route: {
  activate ({ next }) {
    // when done:
    next()
  }
}
```

查看 vue-router 中的[高级示例](https://github.com/vuejs/vue-router/tree/dev/example/advanced)

### 钩子合并

和组件本身的生命周期钩子一样，以下路由生命周期钩子：

- `data`
- `activate`
- `deactivate`

也会在合并选项时（扩展类或是使用 mixins）被合并。举例来说，如果你的组件本身定义了一个路由 `data` 钩子，而这个组件所调用的一个 mixin 也定义了一个路由 `data` 钩子，则这两个钩子都会被调用，并且各自返回的数据将会被最终合并到一起。

需要注意的是，验证类钩子，比如 `canActivate`, `canDeactivate` 和 `canReuse` 在合并选项时会直接被新值覆盖。
