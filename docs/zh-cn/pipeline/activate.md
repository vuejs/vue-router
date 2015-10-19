# `activate(transition) [-> Promise]`

在激活阶段，当组件被创建而且将要切换进入的时候被调用。

### 参数

- [`transition {Transition}`](hooks.md#transition-object)

  调用 `transition.next()` 可以断定（ resolve ）这个钩子函数。注意，这里调用 `transition.abort()` 并不会把应用回退到前一个路由状态因为此时切换已经被确认合法了。

### 预期返回值

- 可选择性返回 Promise。
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### 详情

多数时候，这个函数用于控制视图转换的时机，因为视图切换会在这个函数被断定（ resolved ）之后开始。

这个钩子会从上至下进行调用。子组件视图的 `activate` 只会在父级组件视图 `activate` 被断定（ resolved ）之后执行。
