# 嵌套路由

嵌套路由和嵌套组件之间的匹配是个很常见的需求，使用 vue-router 可以很简单的完成这点。

假设我们有如下一个应用：

``` html
<div id="app">
  <router-view></router-view>
</div>
```

`<router-view>` 是一个顶级的外链。它会渲染一个和顶级路由匹配的组件：

``` js
router.map({
  '/foo': {
    // 路由匹配到/foo时，会渲染一个Foo组件
    component: Foo
  }
})
```

同样的，组件内部也可以包含自己的外链，嵌套的 `<router-view>` 。例如，如果我们在组件 `Foo` 的模板中添加了一个：

``` js
var Foo = {
  template:
    '<div class="foo">' +
      '<h2>This is Foo!</h2>' +
      '<router-view></router-view>' + // <- 嵌套的外链
    '</div>'
}
```

为了能够在这个嵌套的外链中渲染相应的组件，我们需要更新我们的路由配置：

``` js
router.map({
  '/foo': {
    component: Foo,
    // 在/foo下设置一个子路由
    subRoutes: {
      '/bar': {
        // 当匹配到/foo/bar时，会在Foo's <router-view>内渲染
        // 一个Bar组件
        component: Bar
      },
      '/baz': {
        // Baz也是一样，不同之处是匹配的路由会是/foo/baz
        component: Baz
      }
    }
  }
})
```

使用以上的配置，当访问 `/foo` 时，`Foo` 的外链中不会渲染任何东西，因为配置中没有任何子路由匹配这个地址。或许你会想渲染一些内容，此时你可以设置一个子路由匹配 `/` ：

``` js
router.map({
  '/foo': {
    component: Foo,
    subRoutes: {
      '/': {
        // 当匹配到 /foo 时，这个组件会被渲染到 Foo 组件的 <router-view> 中。
        // 为了简便，这里使用了一个组件的定义
        component: {
          template: '<p>Default sub view for Foo</p>'
        }
      },
      // 其他子路由
    }
  }
})
```

查看对应的实例 [在线](http://jsfiddle.net/yyx990803/naeg67da/).
