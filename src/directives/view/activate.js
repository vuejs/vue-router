var routerUtil = require('../../util')

module.exports = function (transition) {
  if (transition.to._aborted) {
    return
  }
  var id = transition._componentID
  var Component = transition._Component
  if (!id || !Component) {
    return this.setComponent(null)
  }
  var hook = routerUtil.getRouteConfig(Component, 'activate')
  if (!hook) {
    this.setComponent(id)
  } else {
    this.setComponent(id, { loading: true }, function (component) {
      var next = transition.next = function (data) {
        if (transition.to._aborted) {
          return
        }
        for (var key in data) {
          component.$set(key, data[key])
        }
        component.loading = false
      }
      var res = hook.call(component, transition)
      if (routerUtil.isPromise(res)) {
        res.then(next, transition.abort)
      }
    })
  }
}
