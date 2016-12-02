
import { warn } from './warn'

export function resolveProps (route, component, config) {
  switch (typeof config) {

    case 'undefined':
      return

    case 'object':
      return config

    case 'function':
      return config(route)

    case 'boolean':
      if (!config) {
        return
      }
      return route.params

    default:
      warn(false, `props in "${route.path}" is a ${typeof config}, expecting an object, function or boolean.`)
  }
}

