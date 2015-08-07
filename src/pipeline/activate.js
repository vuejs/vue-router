var getRouteConfig = require('../util').getRouteConfig

module.exports = function (transition, Component, next) {
  // no component
  if (!Component) {
    return this.setComponent(null)
  }

  var self = this
  var activateHook = getRouteConfig(Component, 'activate')
  var dataHook = getRouteConfig(Component, 'data')

  /**
   * Build new instance, either caused by siwtching to a
   * different component, or because canReuse is false and
   * we need to reload current component.
   */

  var id = 123
  var build = function () {
    var initialData = dataHook
      ? { loadingRouteData: true }
      : null
    self.setComponent(id, initialData, function (component) {
      loadData(component)
    })
  }

  /**
   * Asynchronously load and apply data.
   *
   * @param {Vue} component
   */

  var loadData = function (component) {
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
