import type { default as Vue, VueConstructor, ComponentOptions } from 'vue'
import type { ComponentRenderProxy, PropType } from '@vue/composition-api'

type NonUndefinedable<T> = T extends undefined ? never : T

type DefinePropsToOptions<T> = {
  [K in keyof T]-?: {} extends Pick<T, K>
    ? { type: PropType<NonUndefinedable<T[K]>> }
    : { type: PropType<T[K]>; required: true }
}

type DefineComponentWithProps<Props> = ComponentOptions<
  Vue,
  {},
  {},
  {},
  DefinePropsToOptions<Props>,
  Props
> &
  VueConstructor<Vue> &
  (new (...args: any[]) => ComponentRenderProxy<
    Props,
    {},
    {},
    {},
    {},
    Props,
    {},
    true
  >)

export interface RouterLinkProps {
  /**
   * Denotes the target route of the link. When clicked, the value of the `to` prop will be passed to `router.push()` internally, so the value can be either a string or a location descriptor object.
   */
  to: string | Location
  /**
   * Setting `replace` prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will not leave a history record.
   *
   * @default false
   */
  replace?: boolean
  /**
   * Setting `append` prop always appends the relative path to the current path. For example, assuming we are navigating from `/a` to a relative link `b`, without `append` we will end up at `/b`, but with append we will end up at `/a/b`.
   *
   * @default false
   */
  append?: boolean
  /**
   * Sometimes we want <RouterLink> to render as another tag, e.g <li>. Then we can use tag prop to specify which tag to render to, and it will still listen to click events for navigation.
   *
   * @default "a"
   */
  tag?: string
  /**
   * Configure the active CSS class applied when the link is active. Note the default value can also be configured globally via the `linkActiveClass` router constructor option.
   *
   * @default "router-link-active"
   */
  activeClass?: string
  /**
   * The default active class matching behavior is **inclusive match**. For example, `<RouterLink to="/a">` will get this class applied as long as the current path starts with `/a/` or is `/a`.
   *
   * @default false
   */
  exact?: boolean
  /**
   * Allows matching only using the `path` section of the url, effectively ignoring the `query` and the `hash` sections.
   *
   * @default false
   */
  exactPath?: boolean
  /**
   * Configure the active CSS class applied when the link is active with exact path match. Note the default value can also be configured globally via the `linkExactPathActiveClass` router constructor option.
   *
   * @default "router-link-exact-path-active"
   */
  exactPathActiveClass?: string

  /**
   * Specify the event(s) that can trigger the link navigation.
   *
   * @default 'click'
   */
  event?: string | ReadonlyArray<string>
  /**
   * Configure the active CSS class applied when the link is active with exact match. Note the default value can also be configured globally via the `linkExactActiveClass` router constructor option.
   *
   * @default "router-link-exact-active"
   */
  exactActiveClass?: string
  /**
   * Configure the value of `aria-current` when the link is active with exact match. It must be one of the allowed values for [aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) in the ARIA spec. In most cases, the default of page should be the best fit.
   *
   * @default "page"
   */
  ariaCurrentValue?:
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | 'true'
    | 'false'
}

/**
 * Component to render a link that triggers a navigation on click.
 */
export declare const RouterLink: DefineComponentWithProps<RouterLinkProps>

export interface RouterViewProps {
  /**
   * When a <RouterView> has a name, it will render the component with the corresponding name in the matched route record's components option. See [Named Views](https://router.vuejs.org/guide/essentials/named-views.html) for an example.
   *
   * @default "default"
   */
  name?: string
}

/**
 * Component to display the current route the user is at.
 */
export declare const RouterView: DefineComponentWithProps<RouterViewProps>

export {
  VueRouter as default,
  NavigationFailureType,
  isNavigationFailure,
} from './router'

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
  NavigationFailure,
} from './router'
