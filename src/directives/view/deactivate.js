var util = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  var self = this
  var fromComponent = this.childVM
  var hook = util.getRouteConfig(fromComponent, 'deactivate')
  var next = function () {
    self.activate(transition)
  }

  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next)
  }
}
