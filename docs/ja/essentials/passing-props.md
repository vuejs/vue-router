# ルートコンポーネントにプロパティを渡す

コンポーネントで `$route` を使うと特定のURLでしか使用できないコンポーネントの柔軟性が制限されるルートで密結合を作り出します。

このコンポーネントをルーターが使用するプロパティからこのコンポーネントを分離するには:

**❌ $route に結合**

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

**👍 プロパティによる分離**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true }
  ]
})
```

これにより、コンポーネントをどこからでも使用できるようになり、コンポーネントの再利用とテストが容易になります。

### Boolean モード

props を true に設定すると、route.params がコンポーネントのプロパティとして設定されます。

### Object モード

props がオブジェクトの場合、これはコンポーネントプロパティとしてそのまま設定されます。
プロパティが静的なときに便利です。

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Function モード

プロパティを返す関数を作成することができます。
これにより、パラメータを別のタイプにキャストし、静的な値をルートベースの値などと組み合わせることができます。

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

url `/search?q=vue` は `{query: "vue"}` をプロパティとして SearchUser コンポーネントに渡します。

ルート変更時にのみ評価されるため、プロパティの機能はステートレスにしてください。
ラッパーコンポーネントを使用すると、状態を変更して状態を変更することができます。

高度な使い方については、[example](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js)を参照してください。
