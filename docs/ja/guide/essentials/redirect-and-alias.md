# リダイレクトとエイリアス

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a free video course about Vue Router on Vue School</a></div>

### リダイレクト

`routes` 設定でリダイレクトが可能です。`/a` から `/b` へリダイレクトする例:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

名前付きルートに対してリダイレクトすることもできます。

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

また、function を使った動的なリダイレクトもできます。

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // この function は対象のルートを引数として受け取ります
      // ここではリダイレクト先の path もしくは location を返します
    }}
  ]
})
```

[ナビゲーションガード](../advanced/navigation-guards.md)はリダイレクトするルートに提供されず、ターゲット上のみに適用されるということに注意してください。例では、`beforeEnter` ガードを `/a` ルートに追加しても効果がありません。

その他の高度な使い方として、[例](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js) をご参照ください。

### エイリアス

リダイレクトが意図するところは、ユーザーが `/a` に訪問した時に URL を `/b` に置換し、そして `/b` にマッチさせます。ではエイリアスは何でしょうか?

**`/b` として扱う `/a` のエイリアスは、ユーザーが `/b` に訪問した時に URL は `/b` のままになります。しかし、それはまるでユーザーが `/a` に訪問したかのようにマッチされます。**

上記はルートの設定で以下のように表現されます。

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

設定のネスト構造による制約とは異なり、エイリアスは UI 構造に任意の URL をマップするための自由さがあります。

高度な使い方に関しては、 [例](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js) をご参照ください。
