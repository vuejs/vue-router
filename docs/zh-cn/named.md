# 具名路径

在有些情况下，给一条路径加上一个名字能够让我们更方便地进行路径的跳转。你可以按照下面的示例给一条路径加上名字：

``` js
router.map({
  '/user/:userId': {
    name: 'user', // 给这条路径加上一个名字
    component: { ... }
  }
})
```

可以如下用 `v-link` 链接到该路径：

``` html
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

同样，也可以用 `router.go()` 来切换到该路径：

``` js
router.go({ name: 'user', params: { userId: 123 }})
```

以上两种情况，路由都会最终切换到 `/user/123`。
