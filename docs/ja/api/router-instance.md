# ルーターインスタンス

### プロパティ

#### router.app

- 型: `Vue インスタンス`

  `router` が注入される root の Vue インスタンス

#### router.mode

- 型: `string`

  ルーターが使う [モード](options.md#mode) 。

#### router.currentRoute

- 型: `Route`

  [ルーターオブジェクト](route-object.md) として表される現在のルート。

### メソッド

- **router.beforeEach(guard)**
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

  グローバルなナビゲーションガードの追加。[ナビゲーションガード](../advanced/navigation-guards.md) をご参照ください。

  2.5.0 以降では、3 つのメソッドすべてが、登録されたガード/フックを削除する関数を返します。

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  プログラムによる新しい URL へのナビゲーション。 [プログラムによるナビゲーション](../essentials/navigation.md) をご参照ください。

- **router.getMatchedComponents(location?)**

  現在のルートまたは提供されたロケーションにマッチしているコンポーネント (インスタンスではなく定義 / コンストラクタ) の配列を返します。これは大抵の場合データ取得を行うサーバーサイドレンダリングで使用されます。

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  逆 URL 解決します。`<router-link/>` で使われているものと同じ形式の location が与えられた場合は、以下の解決されたプロパティを返します。

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

 - `current` はデフォルトによる現在のルートです(ほとんどの場合、これを変更する必要はありません)
 - `append` は `current` ルートにパスを追加できます([`router-link`](https://router.vuejs.org/en/api/router-link.html#props)と同様に)

- **router.addRoutes(routes)**

  > 2.2.0+

  動的にルートをルーターに追加します。引数は `routes` コンストラクタオプションで同じルート設定形式を使用する配列でなければなりません。

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  このメソッドは、ルーターが初期ナビゲーションを完了したときに呼び出されるコールバックをキューに入れます。つまり、初期ルートに関連付けられているすべての非同期 enter フックと非同期コンポーネントを解決したことを意味します。

  これは、サーバーとクライアントの両方で一貫した出力を保証するために、サーバーサイドレンダリングに役立ちます。

  第 2 引数 `errorCallback` は 2.4 以降でのみサポートされます。初期ルート解決がエラーの時に、呼び出されます (例: 非同期コンポーネントの解決が失敗)。

- **router.onError(callback)**

  > 2.4.0+

  ルートナビゲーション中にエラーが検出されたときに呼び出されるコールバックを登録します。エラーを呼び出すには、次のいずれかのシナリオが必要であることに注意してください:

  - エラーがルートガード関数内で同期的に投げられる;

  - エラーが補足され、ルートガード関数内で `next(err)` を呼び出すことによって非同期に処理される;

  - ルートを描画するために必須な非同期コンポーネントを解決しようとする時に発生したエラー;
