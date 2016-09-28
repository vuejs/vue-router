# スクロールの振る舞い

クライアントサイドのルーティングを使っている時に、新しいルートに対してスクロールをトップへ移動させたいかもしれません、もしくは実際のページリロードがしているように history 要素のスクロールポジションを保持したいこともあるかもしれません。 `vue-router` ではこれらをさらによく実現できます。ルートナビゲーションにおけるスクロールの挙動を完全にカスタマイズすることができます。

**注意: この機能は HTML5 history モードでのみ動作します。**

ルートインスタンスを作る時に、 `scrollBehavior` 関数を提供できます。

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // 望みのポジションを返す
  }
})
```

`scrollBehavior` 関数は  `to` と `from` のルートオブジェクトを受け取ります。第 3 引数の `savedPosition` は `popstate` ナビゲーション (ブラウザの戻る/進むボタンがトリガーされた) 時のみ利用可能です。

この関数はスクロールポジションオブジェクトを返すことができます。そのオブジェクトは以下のような形式です。

- `{ x: number, y: number }`
- `{ selector: string }`

もし falsy な値や空のオブジェクトが返った場合、何もスクロールは起きません。

例:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

これは単純に全てのルートナビゲーションに対してページスクロールをトップにします。

`savedPosition` を返すことは結果的に戻る/進むボタンを押してナビゲーションした時にネイティブのような挙動になります。

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

もし"アンカーへスクロール"の振る舞いをシミュレートしたい場合は以下のようにしてください。

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

きめの細かいスクロールの挙動コントロールを実装するために [ルートメタフィールド](meta.md) も利用可能です。詳細な例は [こちら](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js) をご参照ください。
