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
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // for nested routes
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // use case sensitive match? (default: false)
    pathToRegexpOptions?: Object; // path-to-regexp options for compiling regex
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

### linkExactActiveClass

> 2.5.0+

- type: `string`

- default: `"router-link-exact-active"`

  Globally configure `<router-link>` default active class for exact matches. Also see [router-link](router-link.md).

### scrollBehavior

- type: `Function`

  Signature:

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

  For more details see [Scroll Behavior](../advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

> 2.4.0+

- type: `Function`

  Provide custom query string parse / stringify functions. Overrides the default.

### fallback

> 2.6.0+

- type: `boolean`

  Controls whether the router should fallback to `hash` mode when the browser does not support `history.pushState`. Defaults to `true`.

  Setting this to `false` essentially makes every `router-link` navigation a full page refresh in IE9. This is useful when the app is server-rendered and needs to work in IE9, because a hash mode URL does not work with SSR.
