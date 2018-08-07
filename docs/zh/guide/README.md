# 起步

::: tip 注意
教程中的案例代码将使用 [ES2015](https://github.com/lukehoban/es6features) 来编写。

同时，所有的例子都将使用完整版的 Vue 以解析模板。更多细节请[移步这里](https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时)。
:::

用 Vue.js + Vue Router 创建单页应用，是非常简单的。使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当你要把 Vue Router 添加进来，我们需要做的是，将组件 (components) 映射到路由 (routes)，然后告诉 Vue Router 在哪里渲染它们。下面是个基本例子：

<ExamplePreview name="basic" initial-view="code"/>

通过注入路由器，我们可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由：

```js
// Home.vue
export default {
  computed: {
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
  },
}
```

该文档通篇都常使用 `router` 实例。留意一下 `this.$router` 和 `router` 使用起来完全一样。我们使用 `this.$router` 的原因是我们并不想在每个独立需要封装路由的组件中都导入路由。

你可以看看这个[在线的](https://jsfiddle.net/yyx990803/xgrjzsup/)例子。

要注意，当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值 `.router-link-active`。查看 [API 文档](../api/#router-link) 学习更多相关内容。
