
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
      if (!component.props) {
        return
      }
      const props = {}
      for (const prop in route.params) {
        const value = route.params[prop]
        if (hasProp(component, prop)) {
          const propType = component.props[prop].type
          if (propType === null || propType === String) {
            props[prop] = value
          } else if (propType === Number && value.match(/^-?([0-9]+|[0-9]*\.[0-9]+)$/)) {
            props[prop] = parseFloat(value)
          }
        }
      }
      return props
    default:
      warn(false, `props in "${route.path}" is a ${typeof config}, expecting an object, function or boolean.`)
  }
}

function hasProp (component, prop) {
  if (!component.props) {
    return false
  }
  return typeof component.props[prop] !== 'undefined'
}
