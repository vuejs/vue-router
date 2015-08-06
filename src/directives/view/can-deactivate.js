var util = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  var self = this
  var fromComponent = this.childVM
  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
  var next = function () {
    self.canActivate(transition)
  }

  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next, true)
  }
}
