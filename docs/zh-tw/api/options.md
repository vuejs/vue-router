
# Router 構造配置

### routes

- 類型: `Array<RouteConfig>`

  `RouteConfig` 的類型定義：

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // 命名路由
    components?: { [name: string]: Component }; // 命名視圖組件
    redirect?: string | Location | Function;
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // 嵌套路由
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // 匹配規則是否大小寫敏感？(默認值：false)
    pathToRegexpOptions?: Object; // 編譯正則的選項
  }
  ```

### mode

- 類型: `string`

- 默認值: `"hash" (瀏覽器環境) | "abstract" (Node.js 環境)`

- 可選值: `"hash" | "history" | "abstract"`

  配置路由模式:

  - `hash`: 使用 URL hash 值來作路由。支持所有瀏覽器，包括不支持 HTML5 History Api 的瀏覽器。

  - `history`: 依賴 HTML5 History API 和服務器配置。查看 [HTML5 History 模式](../essentials/history-mode.md)。

  - `abstract`: 支持所有 JavaScript 運行環境，如 Node.js 服務器端。**如果發現沒有瀏覽器的 API，路由會自動強制進入這個模式。**

### base

- 類型: `string`

- 默認值: `"/"`

  應用的基路徑。例如，如果整個單頁應用服務在 `/app/` 下，然後 `base` 就應該設為 `"/app/"`。

### linkActiveClass

- 類型: `string`

- 默認值: `"router-link-active"`

  全局配置 `<router-link>` 的默認『激活 class 類名』。參考 [router-link](router-link.md)。

### linkExactActiveClass

> 2.5.0+

- 類型: `string`

- 默認值: `"router-link-exact-active"`

  全局配置 `<router-link>` 精確激活的默認的 class。可同時翻閲 [router-link](router-link.md)。

### scrollBehavior

- 類型: `Function`

  簽名:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  更多詳情參考[滾動行為](../advanced/scroll-behavior.md)。

### parseQuery / stringifyQuery

> 2.4.0+

- 類型: `Function`

  提供自定義查詢字元串的解析/反解析函數。覆蓋默認行為。

### fallback

> 2.6.0+

- 類型: `boolean`

  當瀏覽器不支持 `history.pushState` 控制路由是否應該回退到 `hash` 模式。默認值為 `true`。

  在 IE9 中，設置為 `false` 會使得每個 `router-link` 導航都觸發整頁刷新。它可用於工作在 IE9 下的服務端渲染應用，因為一個 hash 模式的 URL 並不支持服務端渲染。

