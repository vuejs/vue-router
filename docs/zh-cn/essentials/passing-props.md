# 路由组件传参

在组件中使用`$route`会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的url上使用，限制了其灵活性。

使用props将组件和路由解耦：

**❌ 与$route耦合**

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

**👍 使用props解耦**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true }
    
    // 对于包含命名视图的路由，你必须分别为每个命名视图添加props选项：
    {
      path: '/user/:id', 
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

这样你便可以在任何地方使用该组件，使得该组件更易于重用和测试。

### 布尔模式

如果props被设置为true，`route.params`将会被设置为组件属性。

### 对象模式

如果props是一个对象，它会被按原样设置为组件属性。当props是静态的时候有用。

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### 函数模式

你可以创建一个函数返回props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

Url: `/search?q=vue` 会将 `{query: "vue"}` 作为属性传递给SearchUser组件。

请尽可能保持props函数为无状态的，因为它只会在路由发生变化时起作用。如果你需要状态来定义props，请使用包装组件，这样vue才可以对状态变化做出反应。


更多高级用法，请查看[例子](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
