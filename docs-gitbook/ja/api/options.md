# ルーターコンストラクタオプション

### routes

- 型: `Array<RouteConfig>`

  `RouteConfig` の型宣言:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // 名前付きルート用
    components?: { [name: string]: Component }; // 名前付き view 用
    redirect?: string | Location | Function;
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // ネストされたルート用
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // センシティブマッチをケースとして使用するかどうか? (デフォルト: false)
    pathToRegexpOptions?: Object; // 正規表現のコンパイルとして path-to-regexp オプション
  }
  ```

### mode

- 型: `string`

- デフォルト: `"hash" (in browser) | "abstract" (in Node.js)`

- 利用可能な値: `"hash" | "history" | "abstract"`

  ルーターモードの設定。

  - `hash`: ルーティングに URL hash を使います。HTML5 History API をサポートしていないブラウザ含めて、全ての Vue がサポートしているブラウザで動作します。

  - `history`: HTML5 History API とサーバーの設定が必要です。[HTML5 History モード](../essentials/history-mode.md) を参照してください。

  - `abstract`: 全ての JavaScript の環境で動作します。 e.g. Node.js を使ったサーバーサイド。 **もしブラウザの API が存在しない場合、ルーターは自動的にこのモードに強制されます。**

### base

- 型: `string`

- デフォルト: `"/"`

  アプリケーションのベース URL です。例えば、 `/app/` 配下で完全なシングルページアプリケーションを提供する場合、 `base` は `"/app/"` の値が使われるべきです。

### linkActiveClass

- 型: `string`

- デフォルト: `"router-link-active"`

  グローバルに設定される `<router-link>` のデフォルトのアクティブクラスです。こちらの [router-link](router-link.md) も参照してください。

### linkExactActiveClass

> 2.5.0+

- 型: `string`

- デフォルト: `"router-link-exact-active"`

  完全一致に対してグローバルな `<router-link>` デフォルトアクティブクラスを設定します。[router-link](router-link.md) も参照してください。

### scrollBehavior

- 型: `Function`

  シグネチャ:

  ```
  type PositionDescriptor =
    { x: number, y: number } |
    { selector: string } |
    ?{}

  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  より詳細については [スクロールの振る舞い](../advanced/scroll-behavior.md) を参照してください。

### parseQuery / stringifyQuery

> 2.4.0+

- 型: `Function`

  カスタムクエリ構文解析関数 / 文字列化関数を提供します。デフォルトを上書きします。

### fallback

> 2.6.0+

- 型: `boolean`

  ブラウザが `history.pushState` をサポートしないとき、 ルーターが `hash` モードにフォールバックかどうか制御します。デフォルトは `true`

  これを `false` に設定すると、本質的に全ての `router-link` ナビゲーションが IE9 においてフルページリフレッシュになります。これは、サーバサイドレンダリングでハッシュモードの URL が機能しないため、IE9 で動作する必要がある場合に便利です。
