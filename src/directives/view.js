module.exports = function (Vue) {

  var _ = Vue.util
  var util = require('../util')
  var pipeline = require('../pipeline')
  var componentDef = Vue.directive('_component')

  // <router-view> extends the internal component directive
  var viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      var route = this.vm.$route
      /* istanbul ignore if */
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
      var router = this.router = route._router
      this.depth = router._views.length
      router._views.unshift(this)
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      componentDef.bind.call(this)
      // activate initial render
      pipeline.activate(this, router._currentTransition)
    },

    unbind: function () {
      this.router._views.$remove(this)
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
