module.exports = function (Vue) {

  var _ = Vue.util
  var util = require('../util')
  var componentDef = Vue.directive('_component')

  // <router-view> extends the internal component directive
  var viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      var route = this.vm.$route
      if (!route) {
        util.warn(
          '<router-view> can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      // all we need to do here is registering this view
      // in the router. actual component switching will be
      // managed by the pipeline.
      this.router = route._router
      this.depth = this.router._views.length
      this.router._views.unshift(this)
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      componentDef.bind.call(this)
      this.activate()
    },

    activate: function () {
      var transition = this.router._currentTransition
      var Component = transition._activateQueue[this.depth].component
      if (!Component) {
        return this.setComponent(null)
      }

      var activateHook = util.getRouteConfig(Component, 'activate')
      var dataHook = util.getRouteConfig(Component, 'data')
      var self = this

      // partially duplicated logic from v-component
      var build = function () {
        self.unbuild(true)
        self.Ctor = self.Component = Component
        var component = self.build()
        if (dataHook) {
          loadData(transition, dataHook, component)
        }
        self.transition(component)
      }

      if (activateHook) {
        transition._callHook(activateHook, null, build)
      } else {
        build()
      }
    },

    reuse: function () {
      var transition = this.router._currentTransition
      var component = this.childVM
      var dataHook = util.getRouteConfig(component)
      if (dataHook) {
        loadData(transition, dataHook, component)
      }
    },

    unbind: function () {
      this.routeState.router._views.$remove(this)
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}

function loadData (transition, hook, component) {
  component.$loading = true
  transition._callHook(hook, component, function (data) {
    if (data) {
      for (var key in data) {
        component.$set(key, data[key])
      }
    }
    component.$loading = false
  })
}
