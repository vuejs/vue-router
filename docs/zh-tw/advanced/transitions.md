
# 過渡動效

`<router-view>` 是基本的動態組件，所以我們可以用 `<transition>` 組件給它添加一些過渡效果：

``` html
<transition>
  <router-view></router-view>
</transition>
```

[`<transition>` 的所有功能](https://cn.vuejs.org/guide/transitions.html) 在這裡同樣適用。

### 單個路由的過渡

上面的用法會給所有路由設置一樣的過渡效果，如果你想讓每個路由組件有各自的過渡效果，可以在各路由組件內使用 `<transition>` 並設置不同的 name。

``` js
const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
```

### 基於路由的動態過渡

還可以基於當前路由與目標路由的變化關係，動態設置過渡效果：

``` html
<!-- 使用動態的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// 接著在父組件內
// watch $route 決定使用哪種過渡
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

查看完整例子請[移步這裡](https://github.com/vuejs/vue-router/blob/next/examples/transitions/app.js)。

