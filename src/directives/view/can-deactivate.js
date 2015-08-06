var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  var self = this
  var fromComponent = this.childVM

  function next () {
    self.canActivate(transition)
  }

  var hook = routerUtil.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition.callHook(hook, fromComponent, next, true)
  }
}
