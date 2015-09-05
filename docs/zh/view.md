# `<router-view>`

`<router-view>`用于渲染匹配的组件，它基于Vue的动态组件系统，所以它继承了一个正常动态组件的很多特性。

- 你可以传递props。
- `<router-view>`中的HTML内容会被插入到相应组件的内容插入点（由content指定）。
- `v-transition`和`transition-mode`的完整支持。注意：为了场景切换效果能正常工作，路由组件必须是一个[片段实例](http://vuejs.org/guide/best-practices.html#Fragment_Instance).
- `v-ref`也得到支持；被渲染的组件会注册到父级组件的`this.$`对象。

然而，它也有一些限制

- `keep-alive`不支持。
- `wait-for`也不支持。你应该使用[切换勾子函数`activate`](pipeline/activate.html)控制切换的时机。
