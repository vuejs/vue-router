var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }
  var fromComponent = this.childVM
  var self = this
  var abort = transition.abort
  var next = transition.next = function () {
    self.canActivate(transition)
  }
  var hook = routerUtil.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    var res = hook.call(fromComponent, transition)
    if (typeof res === 'boolean') {
      res ? next() : abort()
    } else if (routerUtil.isPromise(res)) {
      res.then(function (ok) {
        ok ? next() : abort()
      }, abort)
    }
  }
}
