# 路由规则和路由匹配

Vue-router 做路径匹配时支持动态片段、全匹配片段以及查询参数（片段指的是 URL 中的一部分）。对于解析过的路由，这些信息都可以通过**路由上下文对象**（从现在起，我们会称其为路由对象）访问。
在使用了 vue-router 的应用中，路由对象会被注入每个组件中，赋值为 `this.$route` ，并且当路由切换时，路由对象会被更新。

路由对象暴露了以下属性：

- **$route.path**

  字符串，等于当前路由对象的路径，会被解析为绝对路径，如 `"/foo/bar"` 。

- **$route.params**

  对象，包含路由中的动态片段和全匹配片段的键值对，详情见后文

- **$route.query**

  对象，包含路由中查询参数的键值对。例如，对于 `/foo?user=1` ，会得到 `$route.query.user == 1` 。

- **$route.router**

  路由规则所属的路由器（以及其所属的组件）。

- **$route.matched**

  数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。

- **$route.name**

  当前路径的名字。 (参见[具名路径](./named.md))

### 自定义字段

除了以上这些内置的属性外，在路由设置对象中的其他自定义字段也会被拷贝到最终的路由对象上。例如：

``` js
router.map({
  '/a': {
    component: { ... },
    auth: true // 这里 auth 是一个自定义字段
  }
})
```

当 `/a` 被匹配时，`$route.auth` 的值将会是 `true`。我们可以利用这个特性在全局的钩子函数中进行身份验证：

``` js
router.beforeEach(function (transition) {
  if (transition.to.auth) {
    // 对用户身份进行验证...
  }
})
```

当嵌套的路径被匹配时，每一个路径段的自定义字段都会被拷贝到同一个路由对象上。如果一个子路径和一个父路径有相同的字段，则子路径的值会覆盖父路径的值。

### 在模板中使用

你可以直接在组件模板中使用 `$route` 。例如：

``` html
<div>
  <p>当前路径: {{$route.path}}</p>
  <p>当前路由参数: {{$route.params | json}}</p>
</div>
```

### 路由匹配

#### 动态片段

动态片段使用以冒号开头的路径片段定义，例如 `user/:username` 中，`:username` 就是动态片段。它会匹配注入 `/user/foo` 或者 `/user/bar` 之类的路径。当路径匹配一个含有动态片段的路由规则时，动态片段的信息可以从 `$route.params` 中获得。

使用示例：

``` js
router.map({
  '/user/:username': {
    component: {
      template: '<p>用户名是{{$route.params.username}}</p>'
    }
  }
})
```

一条路径中可以包含多个动态片段，每个片段都会被解析成 `$route.params` 的一个键值对。

例子:

| 模式 | 匹配的路径 | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

#### 全匹配片段

动态片段只能匹配路径中的一个部分，而全匹配片段则基本类似于它的贪心版。例如 `/foo/*bar` 会匹配任何以 `/foo/` 开头的路径。匹配的部分也会被解析为 `$route.params` 中的一个键值对。

例如:

| 模式 | 匹配的路径 | $route.params |
|---------|------|--------|
| /user/*any | /user/a/b/c | `{ any: 'a/b/c' }` |
| /foo/*any/bar | /foo/a/b/bar | `{ any: 'a/b' }` |
