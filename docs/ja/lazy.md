# Lazy Loading Routes

Webpack または Browserify のようなバンドラを使用しているとき、Vue.js 組み込みの[非同期コンポーネント機能](http://jp.vuejs.org/guide/components.html#c64d5f72fddd9b02b5daff9b8c4b6648)を使用すると route コンポーネントを遅延読み込みすることが、いとも簡単にできます。直接あなたの route コンポーネントを定義する代わりに、非同期に実際のコンポーネント定義を解決する関数として定義します:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      // 何らかのコンポーネント定義をサーバから取得 ...
      resolve(MyComponent)
    }
  }
})
```

さて、手動によるコンポーネント検索のハンドリングは理想的ではないですが、Webpack & Browserify のようなバンドラ両方は、それを容易にする方法を提供します。

### Webpack

Webpack は組み込みで非同期なコード分離をサポートします。非同期なコード分離するポイントを示すために、コードにおいて AMD のような `require` シンタックスを使用できます:

``` js
require(['./MyComponent.vue'], function (MyComponent) {
  // ここのコードは、MyComponent.vue が非同期に読み込まれた後に、実行されます
})
```

ルーターと組合せると、次のようになります:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      require(['./MyComponent.vue'], resolve)
    }
  }
})
```

ここでは、`MyComponent.vue` は、それ自身単体でのみ使用される任意の依存関係と一緒に、ルート `/async` がレンダリングする必要があるときだけ、非同期に読み込まれます。

### Browserify

Browserify で同じことを達成するにはちょっとトリッキーですが、[`partition-bundle` プラグイン](https://github.com/substack/browserify-handbook/blob/master/readme.markdown#partition-bundle) で可能です。手動で `json` ファイルにバンドルマッピングを宣言する必要があります:

``` json
{
  "main.js": ["./main.js"],
  "my-component.js": ["./MyComponent.vue"]
}
```

そして `main.js` で、`require` の代わりに `loadjs` 関数を使用して、同じような何かをするでしょう:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      loadjs(['./MyComponent.vue'], resolve)
    }
  }
})
```
