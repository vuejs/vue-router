
# 嵌套路由

實際生活中的應用界面，通常由多層嵌套的組件組合而成。同樣地，URL 中各段動態路徑也按某種結構對應嵌套的各層組件，例如：

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

借助 `vue-router`，使用嵌套路由配置，就可以很簡單地表達這種關係。

接著上節創建的 app：

``` html
<div id="app">
  <router-view></router-view>
</div>
```

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

這裡的 `<router-view>` 是最頂層的出口，渲染最高級路由匹配到的組件。同樣地，一個被渲染組件同樣可以包含自己的嵌套 `<router-view>`。例如，在 `User` 組件的模板添加一個 `<router-view>`：

``` js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

要在嵌套的出口中渲染組件，需要在 `VueRouter` 的參數中使用 `children` 配置：

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 當 /user/:id/profile 匹配成功，
          // UserProfile 會被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 當 /user/:id/posts 匹配成功
          // UserPosts 會被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**要注意，以 `/` 開頭的嵌套路徑會被當作根路徑。 這讓你充分的使用嵌套組件而無須設置嵌套的路徑。**

你會發現，`children` 配置就是像 `routes` 配置一樣的路由配置數組，所以呢，你可以嵌套多層路由。

此時，基於上面的配置，當你訪問 `/user/foo` 時，`User` 的出口是不會渲染任何東西，這是因為沒有匹配到合適的子路由。如果你想要渲染點什麼，可以提供一個 空的 子路由：

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // 當 /user/:id 匹配成功，
        // UserHome 會被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },

        // ...其他子路由
      ]
    }
  ]
})
```

提供以上案例的可運行代碼請[移步這裡](https://jsfiddle.net/yyx990803/L7hscd8h/)。

