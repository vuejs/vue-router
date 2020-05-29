# ネストされたルート

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a free video course about Vue Router on Vue School</a></div>

実際のアプリケーションの UI では通常複数のレベルの階層的にネストしたコンポーネントで構成されます。ネストされたコンポーネントの特定の構造に対して URL のセグメントを対応させることはよくあります。例:

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

`vue-router` を使えば、これらのネストされたルートの設定を使って関連付けをシンプルに表現することができます。

前の章で作ったアプリケーションを考えてみましょう。

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

ここでの `<router-view>` はトップレベルのアウトレットです。トップレベルのルートによってマッチしたコンポーネントが描画されます。同様に描画されたコンポーネントもまた自身のネストされた `<router-view>` を持つことができます。`User` コンポーネントのテンプレート内部に 1 つ追加する例です。

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

このネストされたアウトレットに対してコンポーネントを描画するためには、 `VueRouter` のコンストラクタの設定で `children` オプションを使用する必要があります。

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // /user/:id/profile がマッチした時に
          // UserProfile は User の <router-view> 内部で描画されます
          path: 'profile',
          component: UserProfile
        },
        {
          // /user/:id/posts がマッチした時に
          // UserPosts は User の <router-view> 内部で描画されます
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```
**`/` から始まるネストされたパスは root パスとして扱われることに注意してください。これによってネストされた URL を指定しなくてもコンポーネントをネストすることができます。**

`children` オプションを見るとわかる通り、これは `routes` 自身と同じようなルート設定オブジェクトの配列です。したがって、ネストしている view を必要なだけ保持することができます。

ここまでの点では、上記の設定で `/user/foo` に訪れた時に `User` アウトレット内部で何も描画されません。なぜならば、サブルートにマッチしていないからです。そこに何か描画したい場合は、空のサブルートパスを設定できます。

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // /user/:id がマッチした時に
        // UserHome は User の <router-view> 内部で描画されます
        { path: '', component: UserHome },

        // 他のサブルートも同様に...
      ]
    }
  ]
})
```

この例の動作デモは [こちら](https://jsfiddle.net/yyx990803/L7hscd8h/) です。
