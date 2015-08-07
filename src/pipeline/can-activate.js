var util = require('../util')

module.exports = function (transition, Component, next) {
  util.resolveAsyncComponent(Component, function (Component) {
    // have to check due to async-ness
    if (transition.to._aborted) {
      return
    }
    // determine if this component can be activated
    var hook = util.getRouteConfig(Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition._callHook(hook, null, next, true)
    }
  })
}
