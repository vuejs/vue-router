var getRouteConfig = require('../../util').getRouteConfig

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
  var activateHook = getRouteConfig(Component, 'activate')
  var dataHook = getRouteConfig(Component, 'data')

  function build () {
    var initialData = dataHook
      ? { loadingRouteData: true }
      : null
    self.setComponent(id, initialData, function (component) {
      loadData(component)
    })
  }

  function loadData (component) {
    if (!dataHook || !component) {
      return
    }
    component.loadingRouteData = true
    transition._callHook(dataHook, component, function (data) {
      if (data) {
        for (var key in data) {
          component.$set(key, data[key])
        }
      }
      component.loadingRouteData = false
    })
  }

  if (transition._canReuse) {
    if (transition.to.path !== transition.from.path) {
      // reload data if necessary
      loadData(this.childVM)
    }
  } else if (activateHook) {
    // call activate hook first
    transition._callHook(activateHook, null, build)
  } else {
    // no activate hook, just build
    build()
  }
}
