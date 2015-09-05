# `data(transition) [-> Promise]`

在激活阶段被调用，在`activate`被断定(resolved，指该函数返回的promise被resolve）。 Load and set data on the current component.

### 参数

- [`transition {Transition}`](hooks.md#transition-object)

  调用`transition.next(data)`会为组件的`data`相应属性赋值。例如，使用`{ a: 1, b: 2 }`，路由会调用`component.$set('a', 1)`以及`component.$set('b', 2)`。

### 返回值

- 可选择性返回一个Promise
  - `resolve(data)` -> `transition.next(data)`
  - `reject(reason)` -> `transition.abort(reason)`

### 详情

`data`切换勾子会在`activate`被断定(resolved)以及界面切换之前被调用。切换进来的组件会得到一个名为**`$loadingRouteData`**的元属性，其初始值为`false`，在`data`勾子函数被断定后会被赋值为`true `。这个属性可用来会切换进来的组件展示加载效果。

`data`勾子和`activate`勾子的不同之处在于：

1. `data`在每次路由变动时都会被调用，即使是当前组件可以被重用的时候，但是`activate`尽在组件是新创建时才会被调用。

  假设我们有一个组件对应于路由`/message/:id`，当前用户所处的路径是`/message/1`。当用户浏览`/message/2`时，当前组件可以被重用，所以`activate`不会被调用。但是我们需要根据新的`id`参数去获取和更新数据，所以大部分情况下，在`data`中获取数据比在`activate`中更加合理。

2. `activate`的作用是控制切换到新组件的时机。`data`切换勾子会在`activate`被断定(resolved)以及界面切换之前被调用，所以数据获取和新组件的切入动画是并行进行的，而且在`data`被断定（resolved）之前，组件会处在“加载”状态。

  从用户体验的角度来看一下两者的区别：

  - 如果我们等到获取到数据之后再显示新组件，用户会感觉在切换前界面被卡住了。

  - 相反的话（指不用等到获取数据后再显示组件），我们立刻相应用户的操作，切换视图，展示新组件的“加载”状态。如果我们在CSS中定义好相应的效果，这正好可以用来掩饰数据加载的时间。

这么说的话，如果你想等到数据获取之后再切换视图，可以在组件定义路由选项时，添加**`waitForData: true`**参数。

### 例子

调用`transition.next`：

``` js
route: {
  data: function (transition) {
    setTimeout(function () {
      transition.next({
        message: 'data fetched!'
      })
    }, 1000)
  }
}
```

返回Promise：

``` js
route: {
  data: function () {
    return messageService
      .fetch(transition.to.params.messageId)
      .then(function (message) {
        return { message: message }
      })
  }
}
```

并发请求，利用Promise & ES6:

``` js
route: {
  data ({ to: { params: { userId }}}) {
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(([user, post]) => ({ user, post }))
  }
}
```

与上面等价的ES5版本：

``` js
route: {
  data (transition) {
    var userId = transition.to.params.userId
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(function (data) {
      return {
        user: data[0],
        posts: data[1]
      }
    })
  }
}
```

在模板中使用`$loadingRouteData`：

``` html
<div class="view">
  <div v-if="$loadingRouteData">Loading ...</div>
  <div v-if="!$loadingRouteData">
    <user-profile user="{{user}}"></user-profile>
    <user-post v-repeat="post in posts"></user-post>
  </div>
</div>
```
