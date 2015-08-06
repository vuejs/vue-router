var getRouteConfig = require('../../util').getRouteConfig

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  var self = this
  function next () {
    self.deactivate(transition)
  }

  // no matched component for this outlet
  if (!transition._componentID) {
    return next()
  }

  // resolve async component.
  // this.resolveCtor for compat <= 0.12.8
  var resolver = this.resolveCtor || this.resolveComponent
  resolver.call(this, transition._componentID, function () {
    if (transition.to._aborted) {
      return
    }
    // self.Ctor for compat <= 0.12.8
    transition._Component = self.Ctor || self.Component
    // determine if this component can be activated
    var hook = getRouteConfig(transition._Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition._callHook(hook, null, next, true)
    }
  })
}
