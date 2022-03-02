import { VNode } from 'vue'
import { NavigationFailure, Route } from './Route'

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

interface RouterLinkSlotArgument {
  /**
   * resolved url. This would be the `href` attribute of an `a` element
   */
  href: string
  /**
   * resolved normalized location
   */
  route: Route
  /**
   * function to trigger the navigation. It will automatically prevent events when necessary, the same way `RouterLink` does
   */
  navigate: (e?: MouseEvent) => Promise<undefined | NavigationFailure>
  /**
   * `true` if the [active class](https://v3.router.vuejs.org/api/#active-class) should be applied. Allows to apply an arbitrary class
   */
  isActive: boolean
  /**
   * `true` if the [exact active class](https://v3.router.vuejs.org/api/#exact-active-class) should be applied. Allows to apply an arbitrary class
   */
  isExactActive: boolean
}

/**
 * Component to render a link that triggers a navigation on click.
 */
export declare const RouterLink: new (props: RouterLinkProps) => {
  $props: typeof props
  $scopedSlots: {
    default?: ({
      href,
      route,
      navigate,
      isActive,
      isExactActive
    }: RouterLinkSlotArgument) => VNode[] | undefined
  }
}
