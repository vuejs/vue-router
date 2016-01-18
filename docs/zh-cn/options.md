# 路由选项

当创建路由器实例时，可以使用以下参数自定义路由器的行为。

#### hashbang

- 默认值： true
- 只在 hash 模式下可用

  当 hashbang 值为 true 时，所有的路径都会被格式化为以 `#!` 开头。例如 `router.go('/foo/bar')` 会把浏览器的 URL 设为 `example.com/#!/foo/bar` 。

#### history

- 默认值： false

  启用 HTML5 history 模式。利用 `history.pushState()` 和 `history.replaceState()` 来管理浏览历史记录。

  **注意**： 当使用 HTML5 history 模式时，服务器需要被[正确配置](http://readystate4.com/2012/05/17/nginx-and-apache-rewrite-to-support-html5-pushstate/) 以防用户在直接访问链接时会遇到404页面。

####  abstract

- 默认值： false

  使用一个不依赖于浏览器的浏览历史虚拟管理后端。虚拟模式在测试或者实际的 URL 并不重要时，非常有用。例如 Electron 或者 Cordova 应用。在非浏览器模式下，路由器同样会退化为抽象模式。

#### root

- 默认值： null
- 只在 HTML5 history 模式下可用

  定义路由根路径。在 `router.go()` 、`v-link` 以及在路由对象中配置的所有路径都会解析为此根路径的相对路径，根路径总是会出现在浏览器地址栏的 URL 中。

  例如，对于 `root: '/foo'` ，`v-link="/bar"` 会把浏览器 URL 设置为 `/foo/bar` 。直接访问 `/foo/bar` 会匹配路由配置中的 `/bar` 。

  多数情况下，在应用中并不需要关心 `root` 。

#### linkActiveClass

- 默认值： `"v-link-active"`

  配置当 `v-link` 元素匹配的路径时需要添加到元素上的 class 。只要当前路径以 `v-link` 的 URL 开头，这个 class 就会被添加到这个元素上。活跃匹配的规则和添加的 class 也可以通过 `v-link` 的内联选项单独指定。

#### saveScrollPosition

- 默认值： false
- 只在 HTML5 history 模式下可用

  当用户点击后退按钮时，借助 HTML5 history 中的 `popstate` 事件对应的 state 来重置页面的滚动位置。注意，当 `<router-view>` 设定了相应的场景切换效果时，这个可能不会得到预想的效果。

#### transitionOnLoad

- 默认值： false

  在初次加载时是否对 `<router-view>` 处理场景切换效果。默认情况下，组件在初次加载时会直接渲染。

#### suppressTransitionError

- 默认值： false

  当值为 `true` 时，在场景切换钩子函数中发生的异常会被吞掉。
