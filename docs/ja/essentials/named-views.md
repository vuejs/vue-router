# 名前付きビュー

しばしば、ネストをさせずに同時に複数の view を表示する必要があるでしょう。例えば、`sidebar` view と `main` view を使ったレイアウトを作成する時です。そんな時に名前付きビューは便利です。あなたの view に 1 つのアウトレットを持つのではなく、複数のそれぞれが名前付きの view を持つことができます。名前を持たない `router-view` はその名前として `default` が付与されます。

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

1 つの view は 1 つのコンポーネントを使って描画されます。したがって、同じルートに対する複数の view には複数のコンポーネントが必須になります。この `components` (s が付いている) オプションに注意してください。

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

## ネストされた名前付きビュー

ネストされたビューを持つ名前付きビューを使用して複雑なレイアウトを作成することができます。そうする際に、ネストされた `router-view` コンポーネントを使用するために名前をつける必要があります。設定パネルの例を見てみましょう:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` は普通のコンポーネントです
- `UserSettings` はビューコンポーネントです
- `UserEmailsSubscriptions` 、`UserProfile` 、`UserProfilePreview` はネストされたビューコンポーネントです

**Note**: _そのようなレイアウトに HTML/CSS がどのように表示されるのか、そして使用されるコンポーネントに焦点を当てる方法については、ここでは忘れましょう_

上記レイアウトでの `UserSettings` コンポーネントの `<template>` セクションは次のようになります:

```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_ここではネストされたビューコンポーネントは省略されていますが、上記例の完全なソースコードを[ここ](https://jsfiddle.net/posva/22wgksa3/)で見ることができます_

それから、以下のルート設定で上記のレイアウトを表現することができます:

```js
{ path: '/settings',
  // トップで名前付きビューを持つこともできます
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

この例の動作するデモは、[ここ](https://jsfiddle.net/posva/22wgksa3/)に見ることができます。
