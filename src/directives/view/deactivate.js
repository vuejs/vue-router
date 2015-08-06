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

  var hook = routerUtil.getRouteConfig(fromComponent, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next)
  }
}
