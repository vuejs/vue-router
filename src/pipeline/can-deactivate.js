var util = require('../util')

module.exports = function (transition, view, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next, true)
  }
}
