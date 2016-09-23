declare module 'path-to-regexp' {
  declare var exports: {
    (path: string, keys: Array<?{ name: string }>): RegExp;
    compile: (path: string) => (params: Object) => string;
  }
}

declare type RouterOptions = {
  routes?: Array<RouteConfig>;
  mode?: string;
  base?: string;
  linkActiveClass?: string;
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
  components?: { [name: string]: any };
  redirect?: RedirectOption;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>;
  beforeEnter?: (
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void
  ) => any;
  meta?: any;
}

declare type RouteRecord = {
  path: string;
  components: { [name: string]: any };
  instances: { [name: string]: any };
  name: ?string;
  parent: ?RouteRecord;
  redirect: ?RedirectOption;
  matchAs: ?string;
  beforeEnter: ?(
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void
  ) => any;
  meta: any;
}

declare type RouteMap = {
  [key: string]: RouteRecord;
}

declare type StringHash = { [key: string]: string }

declare type Location = {
  _normalized?: boolean;
  name?: string;
  path?: string;
  hash?: string;
  query?: StringHash;
  params?: StringHash;
}

declare type RawLocation = string | Location

declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: StringHash;
  params: StringHash;
  fullPath: string;
  matched: Array<RouteRecord>;
  redirectedFrom?: string;
  meta?: any;
}

declare type Matcher = (location: RawLocation, current?: Route) => Route;
