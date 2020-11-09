# 遅延ローディングルート

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a free video course about Vue Router on Vue School</a></div>

バンドラーを使ってアプリケーションを構築している時、バンドルされる JavaScript が非常に大きいものになり得ます。結果的にページのロード時間に影響を与えてしまいます。もし各ルートコンポーネントごとに別々のチャンクにして、訪れたルートの時だけロードできればより効率的でしょう。

Vue の [非同期コンポーネント機能](http://jp.vuejs.org/guide/components.html#非同期コンポーネント) と webpack の [コード分割機能](https://webpack.js.org/guides/code-splitting-async/) を組み合わせることでとても簡単に遅延ロードするルートコンポーネントができます。

最初に、非同期コンポーネントは Promise (コンポーネント自身解決する必要がある) を返すファクトリ関数として定義できます:

```js
const Foo = () =>
  Promise.resolve({
    /* component definition */
  })
```

次に、webpack 2 において [動的 import](https://github.com/tc39/proposal-dynamic-import) 構文を使用して、コード分割ポイントを示すことができます:

```js
import('./Foo.vue') // returns a Promise
```

> Note: Babel を使用している場合、Babel が構文を正しく解析するために [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) プラグインを追加する必要があります。

2 つを組み合わせることで、これは、webpack によって自動的にコード分割される非同期コンポーネントを定義する方法です:

```js
const Foo = () => import('./Foo.vue')
```

## 同じチャンク内でのコンポーネントグループ化

しばしば同じ非同期のチャンクに、そのルート配下のネストされた全てのコンポーネントをグループ化したいと思うかもしれません。それを実現するためには、 特別なコメント構文 (webpack > 2.4 必須)を使用してチャンクの名前を提供する [名前付きチャンク](https://webpack.js.org/api/module-methods/#magic-comments) を使う必要があります。

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

webpack は同じチャンク名のどんな非同期のモジュールも同じ非同期のチャンクにグループします。
