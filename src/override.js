module.exports = function (Vue, Router) {
  // overriding Vue's $addChild method, so that every child
  // instance inherits the route data
  var addChild = Vue.prototype.$addChild
  Vue.prototype.$addChild = function (opts, Ctor) {
    var route = this.route
    var router = route && route._router
    var isRouterEnabled = router instanceof Router
    if (isRouterEnabled) {
      opts = Vue.util.mergeOptions(opts || {}, {
        data: {
          route: route
        }
      }, true)
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