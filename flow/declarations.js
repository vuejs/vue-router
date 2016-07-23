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
  scrollBehavior?: boolean | () => boolean | Object;
}

declare type RedirectOption = string | { name: string }

declare type RouteConfig = {
  path: string;
  name?: string;
  component?: any;
  components?: { [key: string]: any };
  redirect?: RedirectOption;
  canActivate: () => void;
  canDeactivate: () => void;
}

declare type RouteRecord = {
  path: string;
  name: ?string;
  parent: ?RouteRecord;
  alias: ?string;
  redirect: ?RedirectOption;
  canActivate: () => void;
  canDeactivate: () => void;
  components: { [name: string]: any };
  instances: { [name: string]: any };
}

declare type Location = {
  _normalized?: boolean;
  name?: string;
  path?: string;
  hash?: string;
  query?: { [key: string]: string };
  params?: { [key: string]: string };
}

declare type RawLocation = string | Location

declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: { [key: string]: string };
  params: { [key: string]: string };
  fullPath: string;
  matched: Array<RouteRecord>;
}

declare type Matcher = (location: RawLocation, current?: Route) => Route;
