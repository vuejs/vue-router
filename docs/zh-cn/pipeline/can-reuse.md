# `canReuse: Boolean | canReuse(transition) -> Boolean`

决定组件是否可以被重用。如果一个组件不可以重用，当前实例会被一个新的实例替换，这个新实例会经历正常的验证和激活阶段。

此路由配置参数可以是一个 Boolean 值或者一个返回同步的返回 Boolean 值的函数。**默认值为 `true` **.

### 参数

- [`transition {Transition}`](hooks.md#transition-object)

  在 `canReuse` 钩子中只能访问 `transition.to` 和 `transition.from` 。

### 预期返回值

- 必须返回 Boolean 类型，其他等效的假值（ Falsy values ）会当作 `false` 对待。

### 详情

`canReuse` 会同步调用，而且从上至下对所有可能重用的组件都会调用。

如果组件可以重用，它的 `data` 钩子在激活阶段仍然会被调用。
