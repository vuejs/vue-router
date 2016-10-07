# 路由懒加载

当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的 [异步组件](http://vuejs.org/guide/components.html#Async-Components) 和 Webpack 的 [code splitting feature](https://webpack.github.io/docs/code-splitting.html), 轻松实现路由组件的懒加载。

我们要做的就是把路由对应的组件定义成异步组件：

``` js
const Foo = resolve => {
  // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
  // （代码分块）
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

这里还有另一种代码分块的语法，使用 AMD 风格的 require，于是就更简单了：

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

不需要改变任何路由配置，跟之前一样使用 `Foo`：

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 把组件按组分块

有时候我们想把某个路由下的所有组件都打包在同个异步 chunk 中。只需要 [给 chunk 命名](https://webpack.github.io/docs/code-splitting.html#named-chunks)，提供 `require.ensure` 第三个参数作为 chunk 的名称:

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack 将相同 chunk 下的所有异步模块打包到一个异步块里面 —— 这也意味着我们无须明确列出 `require.ensure` 的依赖（传空数组就行）。
