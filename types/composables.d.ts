declare module 'vue-router/composables' {
  import type { Route, NavigationGuard, default as VueRouter } from 'vue-router'

  /**
   * Returns the current route location. Equivalent to using `$route` inside templates.
   */
  export function useRoute(): Route

  /**
   * Returns the router instance. Equivalent to using `$router` inside templates.
   */
  export function useRouter(): VueRouter

  /**
   * Add a navigation guard that triggers whenever the current location is about to be updated. Similar to beforeRouteUpdate but can be used in any component. The guard is removed when the component is unmounted.
   *
   * @param updateGuard NavigationGuard
   */
  export function onBeforeRouteUpdate(updateGuard: NavigationGuard): void

  /**
   * Add a navigation guard that triggers whenever the component for the current location is about to be left. Similar to beforeRouteLeave but can be used in any component. The guard is removed when the component is unmounted.
   *
   * @param leaveGuard NavigationGuard
   */
  export function onBeforeRouteLeave(leaveGuard: NavigationGuard): void
}
