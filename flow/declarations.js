declare var document: Document;

declare module 'path-to-regexp' {
  declare var exports: {
    (path: string, keys: Array<?{ name: string }>): RegExp;
    compile: (path: string) => (params: Object) => string;
  }
}

declare type Dictionary<T> = { [key: string]: T }

declare type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | Function | void) => void
) => any

declare type RouterOptions = {
  routes?: Array<RouteConfig>;
  mode?: string;
  base?: string;
  linkActiveClass?: string;
  parseQuery?: (query: string) => Object;
  stringifyQuery?: (query: Object) => string;
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: ?{ x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{};
}

declare type RedirectOption = RawLocation | ((to: Route) => RawLocation)

declare type RouteConfig = {
  path: string;
  name?: string;
  component?: any;
  components?: Dictionary<any>;
  redirect?: RedirectOption;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>;
  beforeEnter?: NavigationGuard;
  meta?: any;
  props?: boolean | Object | Function;
}

declare type RouteRecord = {
  path: string;
  components: Dictionary<any>;
  instances: Dictionary<any>;
  name: ?string;
  parent: ?RouteRecord;
  redirect: ?RedirectOption;
  matchAs: ?string;
  beforeEnter: ?NavigationGuard;
  meta: any;
  props: boolean | Object | Function | Dictionary<boolean | Object | Function>;
}

declare type Location = {
  _normalized?: boolean;
  name?: string;
  path?: string;
  hash?: string;
  query?: Dictionary<string>;
  params?: Dictionary<string>;
  append?: boolean;
  replace?: boolean;
}

declare type RawLocation = string | Location

declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: Array<RouteRecord>;
  redirectedFrom?: string;
  meta?: any;
}
