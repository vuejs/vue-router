# ルートオブジェクト

**ルートオブジェクト**は現在のアクティブなルートの状態を表現しています。現在の URL をパースした情報と、その URL とマッチした**ルートレコード**を保持しています。

ルートオブジェクトは変更不可です。成功した全てのナビゲーションは結果的に新たなルートオブジェクトになります。

ルートオブジェクトは複数の場所に存在します。

- コンポーネント内での `this.$route`、また、 `$route` watcher コールバック内部。

- `router.match(location)` を呼び出した時の返り値。

- ナビゲーションガード内での第 1 引数、第 2 引数として:

  ``` js
  router.beforeEach((route, redirect, next) => {
    // `to` と `from` は両方ともルートオブジェクト
  })
  ```

- `scrollBehavior` 関数内の第 1 引数、第 2 引数として:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // `to` と `from` は両方ともルートオブジェクト
    }
  })
  ```

### ルートオブジェクトプロパティ

- **$route.path**

  - 型: `string`

    現在のルートのパスに等しい文字列。常に絶対パスとして解釈されます。e.g. `"/foo/bar"`

- **$route.params**

  - 型: `Object`

    動的セグメントとスターセグメントの key/value ペアを保持するオブジェクト。もしパラメーターがない場合、この値は空オブジェクトになります。

- **$route.query**

  - 型: `Object`

    クエリ文字列の key/value ペアを保持するオブジェクト。例えば `/foo?user=1` というパスの場合、`$route.query.user == 1` となります。もしクエリがない場合は、この値は空オブジェクトになります。

- **$route.hash**

  - 型: `string`

    hash がある時の現在のルートの hash (# 有り) です。もし hash がない場合、この値は空オブジェクトになります。

- **$route.fullPath**

  - 型: `string`

    クエリや hash を含む完全に解決された URL です。

- **$route.matched**

  - 型: `Array<RouteRecord>`

  現在のルートのネストされた全パスセグメントに対しての**ルートレコード** を保持している配列です。ルートレコードは `routes` 設定の配列 (と `children` 配列) 内のオブジェクトのコピーです。

  ``` js
  const router = new VueRouter({
    routes: [
      // 以下のオブジェクトがルートレコード
      { path: '/foo', component: Foo,
        children: [
          // こちらもルートレコード
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  URL が `/foo/bar` である時、 `$route.matched` は親から子の順番で両方の (クローンされた) オブジェクトを含む配列になります。

- **$route.name**

  名前がある場合の現在のルートの名前です。(詳しくは [名前付きルート](../essentials/named-routes.md) をご参照ください)

- **$route.redirectedFrom**

  もしあれば、リダイレクト元の名前。(参照[リダイレクトとエイリアス](../essentials/redirect-and-alias.md))
