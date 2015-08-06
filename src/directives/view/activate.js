var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }

  // update current route component id
  var id = this._routeComponentID = transition._componentID
  var Component = transition._Component

  // no component
  if (!id || !Component) {
    return this.setComponent(null)
  }

  var self = this
  var hook = routerUtil.getRouteConfig(Component, 'activate')
  var wait = routerUtil.getRouteConfig(Component, 'waitForActivate')

  // TODO: separate activate and data hooks.
  // activate is only called when the component has changed or been reloaded
  // data is called whenever the route has changed and this component is active

  // reusing existing instance, just set new data
  if (transition._canReuse) {
    var component = this.childVM
    if (hook && component) {
      component.routeLoading = true
      transition.callHook(hook, component, function (data) {
        if (data) {
          for (var key in data) {
            component.$set(key, data[key])
          }
        }
        component.routeLoading = false
      })
    }
  } else if (!hook) {
    // no hook, just switch component
    this.setComponent(id)
  } else if (wait) {
    // wait for async hook to finish before
    // switching component
    transition.callHook(hook, null, function (data) {
      self.setComponent(id, data)
    })
  } else {
    // switch component now with routeLoading flag set to
    // true, and add data to component after the hook is
    // resolved.
    this.setComponent(id, { routeLoading: true }, function (component) {
      transition.callHook(hook, component, function (data) {
        if (data) {
          for (var key in data) {
            component.$set(key, data[key])
          }
        }
        component.routeLoading = false
      })
    })
  }
}
