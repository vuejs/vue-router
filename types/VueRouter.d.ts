import Vue, { AsyncComponent, ComponentOptions, PluginFunction } from 'vue'
import {
  ErrorHandler,
  RouterOptions,
  RouterMode,
  Route,
  NavigationGuard,
  RawLocation,
  RouteConfig,
  RouteRecordPublic,
  NavigationFailure,
  NavigationFailureType
} from './Route'
import { RouterLink } from './RouterLink'
import { RouterView } from './RouterView'

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

export declare class VueRouter {
  constructor(options?: RouterOptions)

  app: Vue
  options: RouterOptions
  mode: RouterMode
  currentRoute: Route

  beforeEach(guard: NavigationGuard): Function
  beforeResolve(guard: NavigationGuard): Function
  afterEach(hook: (to: Route, from: Route) => any): Function
  push(location: RawLocation): Promise<Route>
  replace(location: RawLocation): Promise<Route>
  push(
    location: RawLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
  replace(
    location: RawLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
  go(n: number): void
  back(): void
  forward(): void
  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route
  getMatchedComponents(to?: RawLocation | Route): (Component | AsyncComponent)[]
  onReady(cb: Function, errorCb?: ErrorHandler): void
  onError(cb: ErrorHandler): void
  addRoutes(routes: RouteConfig[]): void

  addRoute(parent: string, route: RouteConfig): void
  addRoute(route: RouteConfig): void
  getRoutes(): RouteRecordPublic[]

  resolve(
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location
    route: Route
    href: string
    // backwards compat
    normalizedTo: Location
    resolved: Route
  }

  static install: PluginFunction<never>
  static version: string

  static isNavigationFailure: (
    error: any,
    type?: number
  ) => error is NavigationFailure
  static NavigationFailureType: {
    [k in keyof typeof NavigationFailureType]: NavigationFailureType
  }

  static START_LOCATION: Route

  /**
   * Component to render a link that triggers a navigation on click.
   */
  static readonly RouterLink: typeof RouterLink

  /**
   * Component to display the current route the user is at.
   */
  static readonly RouterView: typeof RouterView
}
