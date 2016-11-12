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

    const name = props.name
    const component = inactive
      ? cache[name]
      : (cache[name] = matched.components[name])

    if (!inactive) {
      const hooks = data.hook || (data.hook = {})
      hooks.init = vnode => {
        matched.instances[name] = vnode.child
      }
      hooks.prepatch = (oldVnode, vnode) => {
        matched.instances[name] = vnode.child
      }
      hooks.destroy = vnode => {
        if (matched.instances[name] === vnode.child) {
          matched.instances[name] = undefined
        }
      }
    }

    return h(component, data, children)
  }
}
