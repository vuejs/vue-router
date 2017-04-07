/* @flow */

import { warn } from './warn'

export function resolveProps (route: Route, props: boolean | Object | Function): any {
  switch (typeof props) {
    case 'undefined':
      return
    case 'object':
      return props
    case 'function':
      return props(route)
    case 'boolean':
      return props ? route.params : undefined
    default:
      warn(false, `props in "${route.path}" is a ${typeof props}, expecting an object, function or boolean.`)
  }
}
