import Vue = require("vue");
/**
 * source code: import { ComponentOptions, PluginFunction } from "vue";
 *
 * This source code in the TypeScript2.0 environment will be error:
 * " ... node_modules / vue-router / types / vue " has no exported member 'ComponentOptions'.
 * " ... node_modules / vue-router / types / vue " has no exported member 'PluginFunction'.
 *
 * Since I have installed Vue2.0, so I directly quoted the vuejs type file.
 * The most reasonable thing is to remove the coupling and make it run properly.
 */
import { ComponentOptions } from "../../vue/types/options";
import { PluginFunction } from "../../vue/types/plugin";

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
  push (location: RawLocation, onComplete?: Function, onAbort?: Function): void;
  replace (location: RawLocation, onComplete?: Function, onAbort?: Function): void;
  go (n: number): void;
  back (): void;
  forward (): void;
  getMatchedComponents (to?: RawLocation): Component[];
  onReady (cb: Function): void;
  addRoutes (routes: RouteConfig[]): void;
  resolve (to: RawLocation, current?: Route, append?: boolean): {
    location: Location;
    route: Route;
    href: string;
    // backwards compat
    normalizedTo: Location;
    resolved: Route;
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

type RoutePropsFunction = (route: Route) => Object;

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
  props?: boolean | Object | RoutePropsFunction;
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
  props: boolean | Object | RoutePropsFunction | Dictionary<boolean | Object | RoutePropsFunction>;
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
