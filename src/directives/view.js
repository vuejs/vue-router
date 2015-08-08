module.exports = function (Vue) {

  var _ = Vue.util
  var routerUtil = require('../util')
  var componentDef = Vue.directive('_component')

  // <router-view> extends the internal component directive
  var viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      var route = this.vm.$route
      if (!route) {
        routerUtil.warn(
          '<router-view> can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      this.routeState = {
        router: route._router,
        route: route,
        componentId: null
      }
      // all we need to do here is registering this view
      // in the router. actual component switching will be
      // managed by the pipeline.
      route._router._views.unshift(this)
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      componentDef.bind.call(this)
      this.activate()
    },

    activate: function (Component) {
      console.log('activate')
    },

    reuse: function () {
      console.log('reuse')  
    },

    unbind: function () {
      this.routeState.router._views.$remove(this)
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
