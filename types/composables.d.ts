import { Route, VueRouter, NavigationGuard } from './router'

/**
 * Returns the current route location. Equivalent to using `$route` inside templates.
 */
export declare function useRoute(): Route
/**
 * Returns the router instance. Equivalent to using `$router` inside templates.
 */
export declare function useRouter(): VueRouter
/**
 * Add a navigation guard that triggers whenever the current location is about to be updated. Similar to beforeRouteUpdate but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param updateGuard NavigationGuard
 */
export declare function onBeforeRouteUpdate(updateGuard: NavigationGuard): void
/**
 * Add a navigation guard that triggers whenever the component for the current location is about to be left. Similar to beforeRouteLeave but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param leaveGuard NavigationGuard
 */
export declare function onBeforeRouteLeave(leaveGuard: NavigationGuard): void

export {
  type RouterMode,
  type RouteMeta,
  type RawLocation,
  type RedirectOption,
  type RouterOptions,
  type RouteConfig,
  type RouteRecord,
  type RouteRecordPublic,
  type Location,
  type Route,
  type NavigationGuard,
  type NavigationGuardNext,
  type NavigationFailure,
  NavigationFailureType,
  isNavigationFailure,
  START_LOCATION,
  type RouterViewProps,
  RouterView,
  type RouterLinkProps,
  type RouterLinkSlotArgument,
  RouterLink,
  VueRouter as default,
} from './router'
