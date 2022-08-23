import './vue'
import { VueRouter, RouterLink, RouterView, START_LOCATION } from './router'

export default VueRouter
export { RouterView, RouterLink, START_LOCATION }

export type {
  RouterMode,
  RouteMeta,
  RawLocation,
  RedirectOption,
  RouterOptions,
  RouteConfig,
  RouteRecord,
  RouteRecordPublic,
  Location,
  Route,
  NavigationGuard,
  NavigationGuardNext,
  NavigationFailureType,
  NavigationFailure
} from './router'

import './composables'
