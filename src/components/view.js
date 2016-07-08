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
    const route = parent.$route
    let depth = 0
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth = parent.$vnode.data.routerViewDepth + 1
        break
      }
      parent = parent.$parent
    }
    data.routerView = true
    data.routerViewDepth = depth
    const matched = route.matched[depth]
    const component = matched && matched.components[props.name]
    return h(component, data, children)
  }
}
