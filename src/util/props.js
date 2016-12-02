
import { warn } from './warn'

const numberRegex = /^-?([0-9]+|[0-9]*\.[0-9]+)$/

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
        if (typeof component.props[prop] !== 'undefined') {
          const propType = component.props[prop].type
          if (propType === null || propType === String) {
            props[prop] = value
          } else if (propType === Number && value.match(numberRegex)) {
            props[prop] = parseFloat(value)
          }
        }
      }
      return props

    default:
      warn(false, `props in "${route.path}" is a ${typeof config}, expecting an object, function or boolean.`)
  }
}

