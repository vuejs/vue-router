import Vue = require("vue");
import { ComponentOptions, PluginFunction } from "vue";

type Component = ComponentOptions<Vue> | typeof Vue;
type Dictionary<T> = { [key: string]: T };

export type RouterMode = "hash" | "history" | "abstract";
export type RawLocation = string | Location;
export type RedirectOption = RawLocation | ((to: Route) => RawLocation);
export type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
) => any

declare class VueRouter {
  constructor (options?: RouterOptions);

  app: Vue;
  mode: RouterMode;
  currentRoute: Route;

  beforeEach (guard: NavigationGuard): void;
  afterEach (hook: (to: Route, from: Route) => any): void;
  push (location: RawLocation): void;
  replace (location: RawLocation): void;
  go (n: number): void;
  back (): void;
  forward (): void;
  getMatchedComponentes (to?: RawLocation): Component[];
  resolve (to: RawLocation, current?: Route, append?: boolean): {
    normalizedTo: Location;
    resolved: Route;
    href: string;
  };

  static install: PluginFunction<never>;
}

export interface RouterOptions {
  routes?: RouteConfig[];
  mode?: RouterMode;
  base?: string;
  linkActiveClass?: string;
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: { x: number, y: number } | undefined
  ) => { x: number, y: number } | { selector: string } | void;
}

export interface RouteConfig {
  path: string;
  name?: string;
  component?: Component;
  components?: Dictionary<Component>;
  redirect?: RedirectOption;
  alias?: string | string[];
  children?: RouteConfig[];
  meta?: any;
  beforeEnter?: NavigationGuard;
}

export interface RouteRecord {
  path: string;
  components: Dictionary<Component>;
  instances: Dictionary<Vue>;
  name?: string;
  parent?: RouteRecord;
  redirect?: RedirectOption;
  matchAs?: string;
  meta: any;
  beforeEnter?: (
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void
  ) => any;
}

export interface Location {
  name?: string;
  path?: string;
  hash?: string;
  query?: Dictionary<string>;
  params?: Dictionary<string>;
  append?: boolean;
  replace?: boolean;
}

export interface Route {
  path: string;
  name?: string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: RouteRecord[];
  redirectedFrom?: string;
  meta?: any;
}
