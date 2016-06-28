# `<router-view>`

`<router-view>` 用于渲染匹配的组件，它基于 Vue 的动态组件系统，所以它继承了一个正常动态组件的很多特性。

- 你可以传递 props。
- `<router-view>` 中的 HTML 内容会被插入到相应组件的内容插入点（由 content 指定）。
- `transition` 和 `transition-mode` 的完整支持。注意：为了场景切换效果能正常工作，路由组件必须不是一个[片断实例](http://vuejs.org/guide/components.html#Fragment_Instance)。
- `v-ref` 也得到支持；被渲染的组件会注册到父级组件的 `this.$` 对象。

然而，它也有一些限制

- ~~`keep-alive` 不支持。~~ `keep-alive` 目前在 0.7.2+ 已经可用。
- `wait-for` 也不支持。你应该使用[切换钩子函数 `activate` ](pipeline/activate.html)控制切换的时机。
