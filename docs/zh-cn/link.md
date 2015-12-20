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

- 在 HTML5 history 模式下使用 `root` 选项时，不需要在 `v-link` 的 URL 中包含 root 路径。

#### 链接活跃时的 class

带有 `v-link` 指令的元素，如果 `v-link` 对应的 URL 匹配当前的路径，该元素会被添加特定的 class。默认添加的 class 是 `.v-link-active`，而判断是否活跃使用的是**包含性匹配**。举例来说，一个带有指令 `v-link="/a"` 的元素，只要当前路径以 `/a` 开头，此元素即会被判断为活跃。

连接是否活跃的匹配也可以通过 `exact` 内联选项来设置为只有当路径完全一致时才匹配：

``` html
<a v-link="{ path: '/a', exact: true }"></a>
```

链接活跃时的 class 名称可以通过在创建路由器实例时指定 `linkActiveClass` 全局选项 来自定义，也可以通过 `activeClass` 内联选项来单独指定：

``` html
<a v-link="{ path: '/a', activeClass: 'custom-active-class' }"></a>
```

#### 其他选项

- **replace**

  一个带有 `replace: true` 的链接被点击时将会触发 `router.replace()` 而不是 `router.go()`。由此产生的跳转不会留下历史记录：

  ``` html
  <a v-link="{ path: '/abc', replace: true }"></a>
  ```

- **append**

  带有 `append: true` 选项的相对路径链接会确保该相对路径始终添加到当前路径之后。举例来说，从 `/a` 跳转到相对路径 `b` 时，如果没有 `append: true` 我们会跳转到 `/b`，但有 `append: true` 则会跳转到 `/a/b`。

  ``` html
  <a v-link="{ path: 'relative/path', append: true }"></a>
  ```

#### 其他注意点

- `v-link` 会自动设置 `<a>` 的 `href` 属性。

- 根据[Vue.js 1.0 binding syntax](https://github.com/vuejs/vue/issues/1325)， `v-link` 不再支持包含 mustache 标签。可以用常规的JavaScript表达式代替 mustache 标签， 例如 `v-link="'user/' + user.name"` 。
