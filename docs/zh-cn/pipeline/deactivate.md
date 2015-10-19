# `deactivate(transition) [-> Promise]`

在激活阶段，当一个组件将要被禁用和移除之时被调用。

### 参数

- [`transition {Transition}`](hooks.md#transition-object)

  调用 `transition.next()` 可以断定（ resolve ）这个钩子函数。注意，这里调用 `transition.abort()` 并不会把应用回退到前一个路由状态因为此时切换已经被确认合法了。

### 预期返回值

- 可选择性返回 Promise
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### 详情

此钩子函数的调用顺序从下至上。父级组件的 `deactivate` 会在子级组件的 `deactivate` 被断定（ resolved ）之后被调用。

新组件的 `activate` 钩子函数会在所有组件的 `deactivate` 钩子函数被断定（ resolved ）之后被调用。
