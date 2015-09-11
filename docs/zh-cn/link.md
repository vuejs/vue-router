# v-link

`v-link` 是一个用来让用户在 vue-router 应用的不同路径间跳转的指令。该指令接受一个 JavaScript 表达式，并会在用户点击元素时用该表达式的值去调用 `router.go`。

``` html
<!-- 字面量路径 -->
<a v-link="'home'">Home</a>

<!-- 效果同上 -->
<a v-link="{ path: 'home' }">Home</a>

<!-- 具名路径 -->
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

你应该使用 `v-link` 而不是 `href` 来处理浏览时的跳转。原因如下：

- 它在 HTML5 history 模式和 hash 模式下的工作方式相同，所以如果你决定改变模式，或者 IE9 浏览器退化为 hash 模式时，都不需要做任何改变。

- 在 HTML5 history 模式下，`v-link` 会监听点击事件，防止浏览器尝试重新加载页面。

- 在 HTML5 history 模式下使用 `root` 选项时，不需要再 `v-link` 的 URL 中包含 root 路径。

#### 链接活跃时的 class

带有 `v-link` 指令的元素，如果 `v-link` 对应的 URL 匹配当前的路径，该元素会被添加特定的 class ：

- 如果当前路径以 `v-link` 的 URL 开头，则 `.v-link-active` 这个 class 会被添加到该元素上。例如，一个带有指令 `v-link="/a"` 的元素，如果当前路径以 `/a` 开头，则此元素会被添加这个 class 。

- 如果 `v-link` 的URL精确匹配当前路径，则 `.v-link-active-exact` 会被添加到该元素上。

链接活跃时的 class 名称可以通过在创建路由器实例时指定 `activeLinkClass` 来自定义。精确匹配时，后缀 `-exact` 会被添加到指定的 class 名称后。

#### 其他注意点

- `v-link` 会自动设置 `<a>` 的 `href` 属性。

- 由于 `v-link` 是个[字面量指令](http://vuejs.org/guide/directives.html#Literal_Directives)，它可以包含 mustache 标签，例如 `v-link="/user/{% raw %}{{user.name}}{% endraw %}"` 。
