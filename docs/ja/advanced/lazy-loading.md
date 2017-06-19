# 遅延ローディングルート

バンドラーを使ってアプリケーションを構築している時、バンドルされる JavaScript が非常に大きいものになり得ます。結果的にページのロード時間に影響を与えてしまいます。もし各ルートコンポーネントごとに別々のチャンクにして、訪れたルートの時だけロードできればより効率的でしょう。

Vue の [非同期コンポーネント機能](http://jp.vuejs.org/guide/components.html#非同期コンポーネント) と webpack の [コード分割機能](https://webpack.js.org/guides/code-splitting-async/) を組み合わせることでとても簡単に遅延ロードするルートコンポーネントができます。

First, an async component can be defined as a factory function that returns a Promise (which should resolve to the component itself)

``` js
const Foo = () => Promise.resolve({ /* component definition */ })
```

Second, in webpack 2, we can use the [dynamic import](https://github.com/tc39/proposal-dynamic-import) syntax to indicate a code-split point:

``` js
import('./Foo.vue') // returns a Promise
```

> Note: if you are using Babel, you will need to add the [syntax-dynamic-import](http://babeljs.io/docs/plugins/syntax-dynamic-import/) plugin so that Babel can properly parse the syntax.

Combining the two, this is how to define an async component that will be automatically code-split by webpack:

``` js
const Foo = () => import('./Foo.vue')
```

### 同じチャンク内でのコンポーネントグループ化

しばしば同じ非同期のチャンクに、そのルート配下のネストされた全てのコンポーネントをグループ化したいと思うかもしれません。それを実現するためには、 特別なコメント構文 (webpack > 2.4 必須)を使用してチャンクの名前を提供する [名前付きチャンク](https://webpack.js.org/guides/code-splitting-async/#chunk-names) を使う必要があります。

``` js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

webpack は同じチャンク名のどんな非同期のモジュールも同じ非同期のチャンクにグループします。
