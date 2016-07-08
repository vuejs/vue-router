export default {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (h, { props, children, parent, data }) {
    data.routerView = true

    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})
    let depth = 0
    let inactive = false

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }

    const matched = route.matched[depth]
    const component = inactive
      ? cache[props.name]
      : (cache[props.name] = matched && matched.components[props.name])

    return h(component, data, children)
  }
}
