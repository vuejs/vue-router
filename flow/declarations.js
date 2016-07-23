declare module 'path-to-regexp' {
  declare var exports: {
    (path: string, keys: Array<string>): RegExp
  }
  declare function compile(path: string): (params: Object) => string;
}

declare type RouteConfig = {
  path: string;
  name?: string;
  component?: any;
  components?: { [key: string]: any };
  redirect?: string | { name: string };
  canActivate: () => void;
  canDeactivate: () => void;
}

declare type RouterOptions = {
  routes?: Array<RouteConfig>;
  mode?: string;
  base?: string;
  linkActiveClass?: string;
  scrollBehavior?: boolean | () => boolean | Object;
}

declare type Location = {

}

declare type Route = {

}
