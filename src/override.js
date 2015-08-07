// overriding Vue's $addChild method, so that every child
// instance inherits the route data

module.exports = function (Vue, Router) {

  var addChild = Vue.prototype.$addChild

  Vue.prototype.$addChild = function (opts, Ctor) {

    var route = this.$route
    var router = route && route._router
    var isRouterEnabled = router instanceof Router

    // inject meta
    if (isRouterEnabled) {
      opts = opts || {}
      var meta = opts._meta = opts._meta || {}
      meta.$route = route
      if (opts._isRouterView) {
        meta.$loading = meta.$loading || false
      }
    }

    var child = addChild.call(this, opts, Ctor)

    if (isRouterEnabled) {
      // keep track of all children created so we can
      // update the routes
      router._children.push(child)
      child.$on('hook:beforeDestroy', function () {
        router._children.$remove(child)
      })
    }

    return child
  }
}
