export interface RouterViewProps {
  /**
   * When a <RouterView> has a name, it will render the component with the corresponding name in the matched route record's components option. See [Named Views](https://v3.router.vuejs.org/guide/essentials/named-views.html) for an example.
   *
   * @default "default"
   */
  name?: string
}

/**
 * Component to display the current route the user is at.
 */
export declare const RouterView: new (props: RouterViewProps) => {
  $props: typeof props
}
