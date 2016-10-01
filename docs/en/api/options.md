# Router Construction Options

### routes

- type: `Array<RouteConfig>`

  Type declaration for `RouteConfig`:

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

  Configure the router mode.

  - `hash`: uses the URL hash for routing. Works in all Vue-supported browsers, including those that do not support HTML5 History API.

  - `history`: requires HTML5 History API and server config. See [HTML5 History Mode](../essentials/history-mode.md).

  - `abstract`: works in all JavaScript environments, e.g. server-side with Node.js. **The router will automatically be forced into this mode if no browser API is present.**

### base

- type: `string`

- default: `"/"`

  The base URL of the app. For example, if the entire single page application is served under `/app/`, then `base` should use the value `"/app/"`.

### linkActiveClass

- type: `string`

- default: `"router-link-active"`

  Globally configure `<router-link>` default active class. Also see [router-link](router-link.md).

### scrollBehavior

- type: `Function`

  Signature:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  For more details see [Scroll Behavior](../advanced/scroll-behavior.md).
