var getRouteConfig = require('../util').getRouteConfig

module.exports = function (transition, componentID, next) {
  // resolve async component.
  // this.resolveCtor for compat <= 0.12.8
  var resolver = view.resolveCtor || view.resolveComponent
  resolver.call(view, componentID, function () {
    if (transition.to._aborted) {
      return
    }
    // self.Ctor for compat <= 0.12.8
    var Component = self.Ctor || self.Component
    // determine if this component can be activated
    var hook = getRouteConfig(Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition._callHook(hook, null, next, true)
    }
  })
}
