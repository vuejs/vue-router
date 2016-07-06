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
    let _parent = parent
    while (_parent) {
      if (_parent.$vnode && _parent.$vnode.data._routerView) {
        depth++
      }
      _parent = _parent.$parent
    }
    data._routerView = true
    return h(
      route.matched[depth].components[props.name],
      data,
      children
    )
  }
}

