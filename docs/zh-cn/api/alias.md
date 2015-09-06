# `router.alias(aliasMap)`

为路由器配置全局的别名规则。别名和重定向的区别在于，相对于重定向把 `fromPath` 替换为 `toPath` ，别名会保留 `fromPath` ，但是匹配时使用的是 `toPath` 。

例如，如果我们把 `/a` 取别名为 `/a/b/c` ，那么当我们访问 `/a` 时，浏览器地址栏中的URL会是 `/a` 。但是路由匹配是却像是在访问 `/a/b/c` 。

### 参数

- `aliasMap {Object}`

  别名映射对象的格式应该为 `{ fromPath: toPath, ... }` 。路径中可以包含动态片段。

### Example

``` js
router.alias({

  // 匹配 /a 时就像是匹配 /a/b/c
  '/a': '/a/b/c',

  // 别名可以包含动态片段
  // 而且重定向片段必须匹配
  '/user/:userId': '/user/profile/:userId'
})
```
