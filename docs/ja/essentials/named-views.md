# 名前付きビュー

しばしば、ネストをさせずに同時に複数の view を表示する必要があるでしょう。例えば、`sidebar` view と `main` view を使ったレイアウトを作成する時です。そんな時に名前付きビューは便利です。あなたの view に 1 つのアウトレットを持つのではなく、複数のそれぞれが名前付きの view を持つことができます。名前を持たない `router-view` はその名前として `default` が付与されます。

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

1 つの view は 1 つのコンポーネントを使ってレンダリングされます。したがって、同じルートに対する複数の view には複数のコンポーネントが必須になります。この `components` (s が付いている) オプションに注意してください。

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

この例の動作しているデモは 
[こちら](https://jsfiddle.net/posva/6du90epg/) です。
