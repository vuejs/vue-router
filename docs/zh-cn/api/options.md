# Router 构造配置

### routes

- type: `Array<RouteConfig>`

  `RouteConfig` 的类型定义：

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // for named routes
    components?: { [name: string]: Component }; // for named views
    redirect?: string | Location | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // for nested routes
    beforeEnter?: (route: Route, redirect: Function, next: Function) => void;
    meta?: any;
  }
  ```

### mode

- type: `string`

- default: `"hash" (in browser) | "abstract" (in Node.js)`

- available values: `"hash" | "history" | "abstract"`

  配置路由模式:

  - `hash`: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。

  - `history`: 依赖 HTML5 History API 和服务器配置。查看 [HTML5 History 模式](../essentials/history-mode.md).

  - `abstract`: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。**如果发现没有浏览器的 API，路由会自动强制进入这个模式。**

### base

- type: `string`

- default: `"/"`

  应用的基路径。例如，如果整个单页应用服务在 `/app/` 下，然后 `base` 就应该设为 `"/app/"`。

### linkActiveClass

- type: `string`

- default: `"router-link-active"`

  全局配置 `<router-link>` 的默认『激活 class 类名』。参考 [router-link](router-link.md).

### scrollBehavior

- type: `Function`

  签名:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  更多详情参考 [滚动行为](../advanced/scroll-behavior.md).
