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

    data.routerViewDepth = depth
    const matched = route.matched[depth]
    if (!matched) {
      return h()
    }

    const component = inactive
      ? cache[props.name]
      : (cache[props.name] = matched.components[props.name])

    if (!inactive) {
      (data.hook || (data.hook = {})).init = vnode => {
        matched.instances[props.name] = vnode.child
      }
    }

    return h(component, data, children)
  }
}
