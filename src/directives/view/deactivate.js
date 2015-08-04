var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }
  var fromComponent = this.childVM
  var self = this
  var abort = transition.abort
  var next = transition.next = function () {
    self.activate(transition)
  }
  var hook = routerUtil.getRouteConfig(fromComponent, 'deactivate')
  if (!hook) {
    next()
  } else {
    var res = hook.call(fromComponent, transition)
    if (routerUtil.isPromise(res)) {
      res.then(next, abort)
    }
  }
}
