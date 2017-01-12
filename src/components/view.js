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

    const name = props.name
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
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

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    const matched = route.matched[depth]
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null
      return h()
    }

    const component = cache[name] = matched.components[name]

    // inject instance registration hooks
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

    return h(component, data, children)
  }
}
