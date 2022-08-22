import './vue'
import { VueRouter, RouterLink, RouterView } from './router'

export default VueRouter
// TODO: does this really work with the new keyword?
export { RouterView, RouterLink }

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
