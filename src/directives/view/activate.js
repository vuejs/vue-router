var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  // no component
  var id = transition._componentID
  var Component = transition._Component
  if (!id || !Component) {
    return this.setComponent(null)
  }

  var hook = routerUtil.getRouteConfig(Component, 'activate')
  var wait = routerUtil.getRouteConfig(Component, 'waitForActivate')
  if (!hook) {
    // no hook, just switch component
    this.setComponent(id)
  } else if (wait) {
    // wait for async hook to finish before
    // switching component
    var self = this
    var next = transition.next = function (data) {
      if (transition.to._aborted) {
        return
      }
      self.setComponent(id, data)
    }
    var res = hook.call(null, transition)
    if (routerUtil.isPromise(res)) {
      res.then(next, transition.abort)
    }
  } else {
    // switch component now with routeLoading flag set to
    // true, and add data to component after the hook is
    // resolved.
    this.setComponent(id, { routeLoading: true }, function (component) {
      var next = transition.next = function (data) {
        if (transition.to._aborted) {
          return
        }
        if (data) {
          for (var key in data) {
            component.$set(key, data[key])
          }
        }
        component.routeLoading = false
      }
      var res = hook.call(component, transition)
      if (routerUtil.isPromise(res)) {
        res.then(next, transition.abort)
      }
    })
  }
}
