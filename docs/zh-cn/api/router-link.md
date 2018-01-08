# `<router-link>`

`<router-link>` 组件支持用户在具有路由功能的应用中（点击）导航。
通过 `to` 属性指定目标地址，默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 `tag` 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。

`<router-link>` 比起写死的 `<a href="...">` 会好一些，理由如下：

- 无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。

- 在 HTML5 history 模式下，`router-link`  会守卫点击事件，让浏览器不再重新加载页面。

- 当你在 HTML5 history 模式下使用 `base` 选项之后，所有的 `to` 属性都不需要写（基路径）了。

### Props

- **to**

  - 类型: `string | Location`

  - required

  表示目标路由的链接。当被点击后，内部会立刻把 `to` 的值传到 `router.push()`，所以这个值可以是一个字符串或者是描述目标位置的对象。

  ``` html
  <!-- 字符串 -->
  <router-link to="home">Home</router-link>
  <!-- 渲染结果 -->
  <a href="home">Home</a>

  <!-- 使用 v-bind 的 JS 表达式 -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- 不写 v-bind 也可以，就像绑定别的属性一样 -->
  <router-link :to="'home'">Home</router-link>

  <!-- 同上 -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- 命名的路由 -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- 带查询参数，下面的结果为 /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - 类型: `boolean`

  - 默认值: `false`

  设置 `replace` 属性的话，当点击时，会调用 `router.replace()` 而不是 `router.push()`，于是导航后不会留下 history 记录。

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - 类型: `boolean`

  - 默认值: `false`

  设置 `append` 属性后，则在当前（相对）路径前添加基路径。例如，我们从 `/a` 导航到一个相对路径 `b`，如果没有配置 `append`，则路径为 `/b`，如果配了，则为 `/a/b`

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - 类型: `string`

  - 默认值: `"a"`

  有时候想要  `<router-link>` 渲染成某种标签，例如 `<li>`。
  于是我们使用 `tag` prop 类指定何种标签，同样它还是会监听点击，触发导航。

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 渲染结果 -->
  <li>foo</li>
  ```

- **active-class**

  - 类型: `string`

  - 默认值: `"router-link-active"`

  设置 链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 `linkActiveClass` 来全局配置。

- **exact**

  - 类型: `boolean`

  - 默认值: `false`

  "是否激活" 默认类名的依据是 **inclusive match** （全包含匹配）。
  举个例子，如果当前的路径是 `/a` 开头的，那么 `<router-link to="/a">` 也会被设置 CSS 类名。

  按照这个规则，每个路由都会激活`<router-link to="/">`！想要链接使用 "exact 匹配模式"，则使用 `exact` 属性：

  ``` html
  <!-- 这个链接只会在地址为 / 的时候被激活 -->
  <router-link to="/" exact>
  ```

  查看更多关于激活链接类名的例子[可运行](https://jsfiddle.net/8xrk1n9f/)

- **event**

  > 2.1.0+

  - 类型: `string | Array<string>`

  - 默认值: `'click'`

  声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。

- **exact-active-class**

  > 2.5.0+

  - 类型: `string`

  - 默认值: `"router-link-exact-active"`

  配置当链接被精确匹配的时候应该激活的 class。注意默认值也是可以通过路由构造函数选项 `linkExactActiveClass` 进行全局配置的。

###  将激活 class 应用在外层元素

有时候我们要让激活 class 应用在外层元素，而不是 `<a>` 标签本身，那么可以用 `<router-link>` 渲染外层元素，包裹着内层的原生 `<a>` 标签：

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

在这种情况下，`<a>` 将作为真实的链接（它会获得正确的 `href` 的），而 "激活时的CSS类名" 则设置到外层的 `<li>`。
