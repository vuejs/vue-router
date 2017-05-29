# 遅延ローディングルート

バンドラーを使ってアプリケーションを構築している時、バンドルされる JavaScript が非常に大きいものになり得ます。結果的にページのロード時間に影響を与えてしまいます。もし各ルートコンポーネントごとに別々のチャンクにして、訪れたルートの時だけロードできればより効率的でしょう。

Vue の [非同期コンポーネント機能](http://jp.vuejs.org/guide/components.html#非同期コンポーネント) と Webpack の [コード分割機能](https://webpack.js.org/guides/code-splitting-require/) を組み合わせることでとても簡単に遅延ロードするルートコンポーネントができます。

必要なことは非同期のルートコンポーネントを定義するだけです。

``` js
const Foo = resolve => {
  // require.ensure はコード分割のための Webpack の特殊な文法です。
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

コード分割の文法の代替として、 AMD 形式の require もあります。これを使うと次のように簡略されます。

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

特にルート設定を変更する必要はなく、普段のように `Foo` を使用するだけです。

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 同じチャンク内でのコンポーネントグループ化

しばしば同じ非同期のチャンクに、そのルート配下のネストされた全てのコンポーネントをグループ化したいと思うかもしれません。それを実現するためには、 `require.ensure` の第 3 引数にチャンクの名前を提供する [名前付きチャンク](https://webpack.js.org/guides/code-splitting-require/#chunkname) を使う必要があります。

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack は同じチャンク名のどんな非同期のモジュールも同じ非同期のチャンクにグループします。つまり、 `require.ensure` に対して明示的に依存関係をリストする必要がありません (したがって空の配列を渡しています)。
