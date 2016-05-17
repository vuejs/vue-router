# Nested Routes

ネストされた routes をネストされたコンポーネントにマッピングすることは共通の要求であり、そしてそれは vue-router では非常に簡単です。

以下の アプリケーションがあると仮定します:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

`<router-view>` はここではトップレベルの outlet です。トップレベルの route でマッチしたコンポーネントでレンダリングします:

``` js
router.map({
  '/foo': {
    // Foo は /foo がマッチしたとき、レンダリングされます
    component: Foo
  }
})
```

同様に、レンダリングされたコンポーネントは、独自のネストされた `<router-view>` を含むことができます。例えば、`Foo` コンポーネントのテンプレート内部に1つ追加する場合:

``` js
var Foo = {
  template:
    '<div class="foo">' +
      '<h2>This is Foo!</h2>' +
      '<router-view></router-view>' + // <- nested outlet
    '</div>'
}
```

このネストされた outlet でコンポーネントをレンダリングするため、我々の route 設定を更新する必要があります:

``` js
router.map({
  '/foo': {
    component: Foo,
    // /foo のもとに subRoutes マップを追加
    subRoutes: {
      '/bar': {
        // /foo/bar がマッチしたとき、
        // Bar は Foo の <router-view> 内部でレンダリングされます
        component: Bar
      },
      '/baz': {
        // Baz に対しても同じですが、/foo/baz がマッチしたときです
        component: Baz
      }
    }
  }
})
```

今、上記設定で、`/foo` にアクセスするとき、サブ route がマッチされないため、`Foo` の outlet 内部では何もレンダリングされません。恐らく、そこに何かレンダリングしたいでしょう。このようなケースは、このケースの `/` サブ route 提供することができます。

``` js
router.map({
  '/foo': {
    component: Foo,
    subRoutes: {
      '/': {
        // このコンポーネントは /foo がマッチされるとき、
        // Foo の <router-view> でレンダリングされます。
        // 便宜上、ここでインラインコンポーネント定義を使用します
        component: {
          template: '<p>Default sub view for Foo</p>'
        }
      },
      // 他のサブ routes ...
    }
  }
})
```

この例の動作デモは[ここ](http://jsfiddle.net/yyx990803/naeg67da/)で見ることができます。
