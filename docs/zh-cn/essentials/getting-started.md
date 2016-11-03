# Getting Started

> 教程中的案例代码将使用 [ES2015](https://github.com/lukehoban/es6features) 来编写。

用 Vue.js + vue-router 创建单页应用，是非常简单的。使用 Vue.js 时，我们就已经把组件组合成一个应用了，当你要把 vue-router 加进来，只需要配置组件和路由映射，然后告诉 vue-router 在哪里渲染它们。下面以vue-cli生成的project为例子讲解vue-router：

### HTML (index.html)

``` html
<div id="app">
</div>
<script src="assets/app.js"></script>
```
这里的id 是用于new Vue的时候$mount绑定的。

### JavaScript (app.js)

``` js
// 0. 如果使用模块化机制编程， 要调用 Vue.use(VueRouter)
// 如果使用webpack或者rollup.js打包，要在config文件中定义分别定义vue,vue-router的alias为vue, router， 
// 否则import vue-router的时候会发生前缀解析错误
import Vue from 'vue'
import VueRouter from 'router'
// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
import App from './components/App.vue'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  // 一个常用参数是mode: 'history', 目的是使项目的URL没有hashtag
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  el: '#app'
  router: router,
  render: h => h(App)
}).$mount('#app')

// 现在，应用已经启动了！
```
### Vue (app.vue)

```  html
<template>
<h1>Hello App!</h1>
  <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- <router-link> will be rendered as an `<a>` tag by default -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</template>
<script>
export default {
  // 这里可以先不写参数，但是一定要export
}
</script>
```

你可以看看这个例子
[live](http://jsfiddle.net/yyx990803/xgrjzsup/)。

要注意，当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值  `.router-link-active`。查看 [API 文档](../api/router-link.md) 学习更多相关内容。
