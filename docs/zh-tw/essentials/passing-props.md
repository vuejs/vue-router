
# 路由組件傳參

在組件中使用`$route`會使之與其對應路由形成高度耦合，從而使組件只能在某些特定的url上使用，限制了其靈活性。

使用props將組件和路由解耦：

** 與$route耦合**

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

** 使用props解耦**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true }

    // 對於包含命名視圖的路由，你必須分別為每個命名視圖添加props選項：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

這樣你便可以在任何地方使用該組件，使得該組件更易於重用和測試。

### 布爾模式

如果props被設置為true，`route.params`將會被設置為組件屬性。

### 對象模式

如果props是一個對象，它會被按原樣設置為組件屬性。當props是靜態的時候有用。

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### 函數模式

你可以創建一個函數返回props。這樣你便可以將參數轉換成另一種類型，將靜態值與基於路由的值結合等等。

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

Url: `/search?q=vue` 會將 `{query: "vue"}` 作為屬性傳遞給SearchUser組件。

請儘可能保持props函數為無狀態的，因為它只會在路由發生變化時起作用。如果你需要狀態來定義props，請使用包裝組件，這樣vue才可以對狀態變化做出反應。

更多高級用法，請查看[例子](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js)。

