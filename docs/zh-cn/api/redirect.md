# `router.redirect(redirectMap)`

为路由器定义全局的重定向规则。全局的重定向会在匹配当前路径之前执行。如果发现需要进行重定向，原本访问的路径会被直接忽略而且不会在浏览器历史中留下记录。

### 参数

- `redirectMap: Object`

  重定向映射对象的格式应该为 `{ fromPath: toPath, ... }` 。路径中可以包含动态片段。

### Example

``` js
router.redirect({

  // 重定向 /a 到 /b
  '/a': '/b',

  // 重定向可以包含动态片段
  // 而且重定向片段必须匹配
  '/user/:userId': '/profile/:userId',

  // 重定向任意未匹配路径到 /home
  '*': '/home'
})
```
