# Getting Started

> 教程中的案例代码将使用 [ES2015](https://github.com/lukehoban/es6features) 来编写。

用 Vue.js + vue-router 创建单页应用，是非常简单的。使用 Vue.js 时，我们就已经把组件组合成一个应用了，当你要把 vue-router 加进来，只需要配置组件和路由映射，然后告诉 vue-router 在哪里渲染它们。下面是个基本例子：

### HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. 如果使用模块化机制编程， 要调用 Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点在讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')

// 现在，应用已经启动了！
```

你可以看看这个例子
[live](http://jsfiddle.net/yyx990803/xgrjzsup/)。

要注意，当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值  `.router-link-active`。查看 [API 文档](../api/router-link.md) 学习更多相关内容。
