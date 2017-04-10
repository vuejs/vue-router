# プログラムによるナビゲーション

宣言的なナビゲーションとしてアンカータグを作成する `<router-link>` がありますが、ルーターのインスタンスメソッドを使ったプログラムによる方法でもそれは可能です。

#### `router.push(location, onComplete?, onAbort?)`

**注意: Vue インスタンスの内部では、`$router` としてルーターインスタンスにアクセスできます。従って、`this.$router.push` で呼ぶことができます。**

異なる URL へ遷移するときに `router.push` が使えます。このメソッドは history スタックに新しいエントリを追加します。それによってユーザーがブラウザの戻るボタンをクリックした時に前の URL に戻れるようになります。


このメソッドは `<router-link>` をクリックした時に内部的に呼ばれています。つまり `<router-link :to="...">` をクリックすることは `router.push(...)` を呼ぶことと等価です。

| 宣言的 | プログラム的 |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

引数は文字列のパス、もしくは、location を記述するオブジェクトが使えます。例:

``` js
// 文字列パス
router.push('home')

// オブジェクト
router.push({ path: 'home' })

// 名前付きルート
router.push({ name: 'user', params: { userId: 123 }})

// 結果的に /register?plan=private になる query
router.push({ path: 'register', query: { plan: 'private' }})
```

2.2.0 以降では、必要に応じて、第 2 引数と第 3 引数として `router.push` または `router.replace` に `onComplete` と `onAbort` コールバックを指定します。これらのコールバックは、ナビゲーションが正常に完了したとき(すべての非同期フックが解決された後)に呼び出されるか、またはそれぞれ中止されます(現在のナビゲーションが終了する前に同じルートまたは別のルートにナビゲートされた)

#### `router.replace(location, onComplete?, onAbort?)`

これは `router.push` のように動作しますが、異なる点は新しい history エントリを追加しないで遷移することです。この名前から推定されるように、現在のエントリを置換します。

| 宣言的 | プログラム的 |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### `router.go(n)`

このメソッドは、history スタックの中でどのくらいステップを進めるか、もしくは戻るのか、を表す 1 つの integer をパラメーターとして受け取ります。`window.history.go(n)` と類似しています。

例

``` js
// 1 つレコードを進める。history.forward() と同じ
router.go(1)

// 1 つレコードを戻す。history.back() と同じ
router.go(-1)

// 3 つレコードを進める
router.go(3)

// もし多くのレコードが存在しない場合、サイレントに失敗します
router.go(-100)
router.go(100)
```

#### History 操作

もしかすると `router.push`、`router.replace`、`router.go` は [`window.history.pushState`、`window.history.replaceState`、`window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History) と対応することにお気づきかもしれません。これらは `window.history` API を模倣しています。

したがって、もしあなたが既に [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API) について詳しい場合は、vue-router による History 操作はとても簡単です。

vue-router のナビゲーションメソッド (`push`、`replace`、`go`) は全てのモード (`history`、`hash`、`abstract`) で一貫して動作することは特筆すべき点です。
