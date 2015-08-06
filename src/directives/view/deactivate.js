var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  var self = this
  var fromComponent = this.childVM

  function next () {
    self.activate(transition)
  }

  if (transition._reuse) {
    return next()
  }

  var hook = routerUtil.getRouteConfig(fromComponent, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition.callHook(hook, fromComponent, next)
  }
}
