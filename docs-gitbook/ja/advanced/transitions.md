# トランジション

基本的に `<router-view>` は動的コンポーネントなので、 `<transition>` コンポーネントを使うのと同じ方法でトランジションを適用することができます。

``` html
<transition>
  <router-view></router-view>
</transition>
```

[`<transition>` についての全て](http://jp.vuejs.org/guide/transitions.html) はここでも動作します。

### ルート単位のトランジション

上記の使い方では全てのトランジションが全てのルートに対して適用されます。もし各ルートコンポーネントにそれぞれ違うトランジションを持たせたい場合は、代わりにルーターコンポーネント内で異なる名前で `<transition>` を使うことができます。

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

### ルートベースの動的トランジション

対象のルートと現在のルートの関係を元に動的にトランジションを決定することも可能です。

``` html
<!-- 動的なトランジション名の使用 -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// そして親コンポーネントの中で、
// `$route` を watch して使用するトランジションを決定します
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

完全な例は [こちら](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js) をご参照ください。
