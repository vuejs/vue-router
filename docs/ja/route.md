# Route オブジェクト & Route マッチング

Vue-router は動的セグメントを含んだマッチングしたパス、スターセグメント、そしてクエリ文字列をサポートします。全てのパースされた route のこれらの情報は、公開された **Route コンテキストオブジェクト** (以降でそれらを "route" オブジェクトと呼びます) で利用できます。route オブジェクトは `this.$route` として vue-router が使用可能になったアプリケーションにおいて全てのコンポーネントに導入され、そして route トランジションが実行されるたびに更新されます。

route オブジェクトは以下のプロパティを公開します:

- **$route.path**

  現在の route のパスと等しい文字列、常に絶対パスで解決されます。例: `"/foo/bar"`

- **$route.params**

  動的セグメントの key/value のペアまたはスターセグメントを含んだオブジェクト。より詳細は以下で説明します。

- **$route.query**

  query 文字列の key/value のペアを含んだオブジェクト。例えば、`/foo?user=1` のようなパスに対しては、`$route.query.user == 1` を取得します。

- **$route.router**

  この route (そしてそのオーナー自身のコンポーネント) を管理しているルーターインスタンス。

- **$route.matched**

  現在の route で全てマッチされたセグメントに対する route 設定オブジェクトを含んでいる配列。

- **$route.name**

  route オブジェクトがある場合は、現在の route の名前。([named routes](./named.md) を参照)

### カスタムフィールド

上記のビルトインプロパティに加えて、route 設定で定義されたカスタムフィールドも、route オブジェクトにマージされます。例:

``` js
router.map({
  '/a': {
    component: { ... },
    auth: true
  }
})
```

`/a` がマッチされるとき、`$route.auth` は `true` になります。これはグローバルフックで認証チェックを実行することができます:

``` js
router.beforeEach(function (transition) {
  if (transition.to.auth && !authenticated) {
    transition.redirect('/login')
  } else {
    transition.next()
  }
})
```

> どのように `beforeEach` フックが動作するかは、[API](api/before-each.md) を参照してください。

ネストされた route がマッチされるとき、全てのカスタムフィールドは同じ `$route` オブジェクトにマージされます。サブ route と 親 route が同じカスタムフィールドを持っているとき、サブ route の値は親の値で上書きされます。

### テンプレートでの使用

あなたのコンポーネントのテンプレート内部で、直接 `$route` オブジェクトにバインドできます。例えば:

``` html
<div>
  <p>Current route path: {{$route.path}}</p>
  <p>Current route params: {{$route.params | json}}</p>
</div>
```

### Route マッチング

#### 動的セグメント

動的セグメントは先頭のコロン(:) とパスセグメントの形で定義することができます。`user/:username` での例では、`:username` は動的セグメントです。`/user/foo` または `/user/bar` のようなパスにマッチします。動的セグメントを含んでいるパスとマッチされたとき、動的セグメントは `$route.params` 内部で利用できるようになります。

使用例:

``` js
router.map({
  '/user/:username': {
    component: {
      template: '<p>username is {{$route.params.username}}</p>'
    }
  }
})
```

パスは複数の動的セグメントを含むことができ、そしてそれらごとに `$route.params` に key/value のペアとして保存されます。

例:

| パターン | マッチしたパス | $route.params |
| -------- | -------------- | ------------- |
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

#### スターセグメント

動的セグメントはパスで単一のセグメントのみ対応することができるものの、スターセグメントは基本的にそれの"貪欲(greedy)"バージョンです。例えば、`/foo/*bar` は `/foo` で開始される全てのものマッチします。スターセグメントによって一致した部分は、`$route.params` で利用できるようになります。

例:

| パターン | マッチしたパス | $route.params |
| -------- | -------------- | ------------- |
| /user/*any | /user/a/b/c | `{ any: 'a/b/c' }` |
| /foo/*any/bar | /foo/a/b/bar | `{ any: 'a/b' }` |
