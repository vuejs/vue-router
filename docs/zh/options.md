# 路由选项

当创建路由器实例时，可以使用以下参数自定义路由器的行为。

#### hashbang

- 默认值： true
- 只在hash模式下可用

  当hashbang值为true时，所有的路径都会被格式化为以`#!`开头。例如`router.go('/foo/bar')`会把浏览器的URL设为`example.com/#!/foo/bar`。

#### history

- 默认值： false

  启用HTML5 history模式。利用`history.pushState()`和`history.replaceState()`来管理浏览历史记录。

  **注意**： 当使用HTML5 history模式时，服务器需要被[正确配置](http://readystate4.com/2012/05/17/nginx-and-apache-rewrite-to-support-html5-pushstate/) 以防用户在直接访问链接时会遇到404页面。

####  abstract

- 默认值： false

  使用一个不依赖于浏览器的浏览历史虚拟管理后端。虚拟模式在测试或者实际的URL并不重要时，非常有用。例如Electron或者Cordova应用。在非浏览器模式下，路由器同样会退化为抽象模式。

#### root

- 默认值： null
- 只在HTML5 history模式下可用

  定义路由根路径。在`router.go()`、`v-link`以及在路由对象中配置的所有路径都会解析为此根路径的相对路径，根路径总是会出现在浏览器地址栏的URL中。

  例如，对于`root: '/foo'`，`v-link="/bar"`会把浏览器URL设置为`/foo/bar`。直接访问`/foo/bar`会匹配路由配置中的`/bar`。

  多数情况下，在应用中并不需要关心`root`。

#### linkActiveClass

- 默认值： `"v-link-active"`

  配置当`v-link`元素匹配的路径时需要添加到元素上的class。只要当前路径以`v-link`的URL开头，这个class就会被添加到这个元素上；当`v-link`的URL精确匹配当前路径时，以`-exact`额外的class会被添加到当前`v-link`元素上。默认的class是`v-link-active-exact`。如果你配置这个class为`my-custom-active`，当精确匹配时会被添加到元素上的class是`my-custom-active-exact`。

#### saveScrollPosition

- 默认值： false
- 只在HTML5 history模式下可用

  当用户点击后退按钮是，借助HTML5 history中的`popstate`事件对应的state来重置页面的滚动位置。注意，当`<router-view>`设定了相应的场景切换效果时，这个可能不会得到预想的效果。

#### transitionOnLoad

- 默认值： false

  在初次加载时是否对`<router-view>`处理场景切换效果。默认情况下，组件在初次加载时会直接渲染。

#### suppressTransitionError

- 默认值： false

  当值为`true`时，在场景切换勾子函数中发生的异常会被吞掉。
