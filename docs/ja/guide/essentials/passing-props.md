# ルートコンポーネントにプロパティを渡す

コンポーネントで `$route` を使うとコンポーネントとルートの間に密結合が生まれ、コンポーネントが特定のURLでしか使用できないなど柔軟性が制限されます。

コンポーネントをルーターから分離するために `props` オプションを使います:

**  `$route` に結合**

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

**  `props` による分離**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 名前付きビューによるルートに対しては、名前付きビューごとに `props` オプションを定義しなければなりません:
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

これにより、コンポーネントをどこからでも使用できるようになり、コンポーネントの再利用とテストが容易になります。

### Boolean モード

`props` を `true` に設定すると、`route.params` がコンポーネントのプロパティとして設定されます。

### Object モード

`props` がオブジェクトの場合、これはコンポーネントプロパティとしてそのまま設定されます。プロパティが静的なときに便利です。

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Function モード

プロパティを返す関数を作成することができます。これにより、パラメータを他のタイプにキャストし、静的な値をルートベースの値などと組み合わせることができます。

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

URL `/search?q=vue` は `{query: 'vue'}` をプロパティとして `SearchUser` コンポーネントに渡します。

ルート変更時にのみ評価されるため、`props` 関数はステートレスにしてください。プロパティを定義するために状態を必要とする場合はラッパーコンポーネントを使用してください。その方法で vue は状態変更に対応することができます。

高度な使い方については、[example](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js)を参照してください。
