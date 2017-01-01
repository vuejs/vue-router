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
- **router.afterEach(hook)**

  グローバルなナビゲーションガードの追加。[ナビゲーションガード](../advanced/navigation-guards.md) をご参照ください。


- **router.push(location)**
- **router.replace(location)**
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
    normalizedTo: Location;
    resolved: Route;
    href: string;
  }
  ```
