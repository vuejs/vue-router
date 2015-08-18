// overriding Vue's $addChild method, so that every child
// instance inherits the route data

export default function (Vue) {

  let addChild = Vue.prototype.$addChild

  Vue.prototype.$addChild = function (opts, Ctor) {

    let route = this.$route
    let router = route && route.router

    // inject meta
    if (router) {
      opts = opts || {}
      let meta = opts._meta = opts._meta || {}
      meta.$route = route
      if (opts._isRouterView) {
        meta.$loadingRouteData = meta.$loadingRouteData || false
      }
    }

    let child = addChild.call(this, opts, Ctor)

    if (router) {
      // keep track of all children created so we can
      // update the routes
      router._children.push(child)
      child.$on('hook:beforeDestroy', () => {
        router._children.$remove(child)
      })
    }

    return child
  }
}
